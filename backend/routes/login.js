const Player = require('../dataAccess/player');
const { postDivReqResSchema } = require('./schemaHelpers');
const { LoginReqSchema } = require('../schemas/login');
const { LoginResSchema } = require('../schemas/login');

// Handles login of registered users, returns player object and jwt token for further api calls
async function userLogin(fastify, options) {

fastify.post('/api/login', postDivReqResSchema(LoginReqSchema, LoginResSchema), async (request, reply) => {
	const { e_mail, password } = request.body;
	const user = await Player.findPlayerByEMail(e_mail);
	if (!user || user.password !== password) {
		return reply.status(401).send({ error: 'Invalid e-mail or password' });
	}
	const token = fastify.jwt.sign({ id: user.id, name: user.name }, { expiresIn: '1h' });
	await Player.setPlayerOnline(user);
	reply.send({ ...user, token });
});

}

// function used in playerRoutes to protect respective apis in case JWT token is invalid
async function authenticate(request, reply) {
	try {
		await request.jwtVerify();
	} 
	catch (error) {
		reply.send(error);
	}
}

module.exports = { userLogin, authenticate };