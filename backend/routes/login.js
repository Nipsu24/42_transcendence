const Player = require('../dataAccess/player');
const { postDivReqResSchema } = require('./schemaHelpers');
const { LoginReqSchema } = require('../schemas/login');
const { LoginResSchema } = require('../schemas/login');
const { OAuth2Client } = require('google-auth-library'); // needed for google sign-in (updated after initial 'npm install google-auth-library' in package.json)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // needed for google sign-in
const bcrypt = require('bcryptjs');

// Handles login of registered users, returns player object and jwt token for further api calls
async function userLogin(fastify, options) {
	fastify.post('/api/login', postDivReqResSchema(LoginReqSchema, LoginResSchema), async (request, reply) => {
		const { e_mail, password } = request.body;
		const user = await Player.findPlayerByEMail(e_mail);
		if (!user) {
			return reply.status(401).send({ error: 'Invalid user credentials' });
		}
		const storedHashedPassword = user.password;
		const userInputPassword = password;

		const result = await bcrypt.compare(userInputPassword, storedHashedPassword);
		if (!result) {
			return reply.status(401).send({ error: 'Invalid user credentials' });
		}

		const token = fastify.jwt.sign({ id: user.id, name: user.name }, { expiresIn: '1h' });
		await Player.setPlayerOnline(user);
		reply.send({ ...user, token });
	}); // changed so that google endpoint is not nested instide api/login endpoint

	fastify.post('/api/google-signin', async (request, reply) => {
		try {
			const { idToken } = request.body;
			const ticket = await googleClient.verifyIdToken({
				idToken,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
			const payload = ticket.getPayload();
			const { email, name, picture } = payload;

			let user = await Player.findPlayerByEMail(email);
			if (!user) {
				user = await Player.createPlayer({
					name,
					e_mail: email,
					avatar: picture,
					auth: 'google',
				});
			}
			const token = fastify.jwt.sign({ id: user.id, name: user.name }, { expiresIn: '1h' });
			await Player.setPlayerOnline(user);
			reply.send({ ...user, token });
		} catch (error) {
			reply.status(401).send({ error: 'Google authentication failed' });
		}
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
