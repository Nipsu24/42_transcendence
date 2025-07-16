require('dotenv').config()
const fastify = require('fastify')({ logger: true });
const PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fastifyStatic = require('@fastify/static');
const playerRoutes = require('./routes/playerRoutes');
const registrationRoute = require('./routes/registration');
const { userLogin } = require('./routes/login')
const { log } = require('console');
const multipart = require('@fastify/multipart');

// needed for handling static frontend files in test environment (not needed for production)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'dist'),
	prefix: '/',
});

// registers JWT plugin
fastify.register(require('@fastify/jwt'), {
	secret: process.env.JWT_SECRET
	// secret: 'hello'
});

//imports code from the player apis (e.g. ./routes/playerRoutes.js)
fastify.register(multipart);
fastify.register(playerRoutes);
fastify.register(userLogin);
fastify.register(registrationRoute);

// handles errors (e.g. if post request payload not according to schema)
// does not throw error if additional fields not defined by schema are sent, as they are automatically ignored by fastify ajv
fastify.setErrorHandler((error, request, reply) => {
	if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID')
		return reply.status(401).send({ error: 'Invalid or expired authorization token.' });
	if (error.validation) {
		if (request.method === 'POST' && request.url.startsWith('/api/registration'))
			return reply.status(400).send({ error: 'Invalid player info data: name, e_mail and password required.' });
		else if (request.method === 'POST' && request.url.startsWith('/api/login'))
			return reply.status(400).send({ error: 'Invalid player data: e_mail and password required' });
		else if (request.method === 'PUT' && request.url.startsWith('/api/players/me/stats'))
			return reply.status(400).send({ error: 'Invalid player data: victory and defeats are required, min. 0, max 1000' });
		else if (request.method === 'POST' && request.url.startsWith('/api/players/me/matches'))
			return reply.status(400).send({ error: 'Invalid match data: resultPlayerOne, resultPlayerTwo and aiOpponent are required. Results need to be <= 10' });
		else if (request.method === 'POST' && request.url.startsWith('/api/players/me/friends'))
			return reply.status(400).send({ error: 'Invalid friend data: "name" required.' });
		else if (request.method === 'PUT' && request.url.startsWith('/api/players/me'))
			return reply.status(400).send({ error: 'Invalid player info data: name and/or e_mail required.' });
		else {
			console.log('error:', (error));
			return reply.status(400).send({ error: 'Invalid request data.' });
		}
	} 
	else
		console.log('error:', (error));
		return reply.status(500).send({ error: 'An internal server error occurred.' });
});

// defines port on which backend is listening (taken from .env file)
fastify.listen( {port: PORT, host:'0.0.0.0'}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});