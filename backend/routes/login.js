const Player = require('../dataAccess/player');

// Handes login of registered users, returns jwt token for further api calls
async function userLogin(fastify, options) {

fastify.post('/api/login', async (request, reply) => {
	const { e_mail, password } = request.body;
	const user = await Player.findPlayerByEMail(e_mail);
	if (!user || user.password !== password) {
		return reply.status(401).send({ error: 'Invalid e-mail or password' });
	}
	const token = fastify.jwt.sign({ id: user.id, name: user.name }, { expiresIn: '1h' });
	reply.send({ token });
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