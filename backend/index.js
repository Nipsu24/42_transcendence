require('dotenv').config()
const fastify = require('fastify')({ logger: true });
// MODIFIED!! 
// Changed the port from 3000 to 3001 to fix backend connection in prod compile
const PORT = parseInt(process.env.PORT, 10) || 3001;
//
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

// NEW!!
// Serve uploaded user files under the /uploads path (e.g., profile pictures)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'uploads'),
	prefix: '/uploads/', // public URL path
	decorateReply: false // avoid redecorating reply object
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

// NEW!!
// Handles client-side routing for a React SPA using BrowserRouter.
// When users reload or directly access frontend routes (e.g. /mymenu, /profile),
// Fastify would return 404 by default since these paths don't exist on the server.
//
// This catch-all intercepts such GET requests (excluding /api, /uploads, and file requests),
// and serves index.html so React Router can handle the route.
//
// Actual unknown API or static file requests still return a proper 404.
fastify.setNotFoundHandler((request, reply) => {
	if (request.raw.method === 'GET' && !request.url.startsWith('/api') && !request.url.startsWith('/uploads') && !request.url.includes('.')) {
	  return reply.type('text/html').sendFile('index.html');
	} else {
	  reply.status(404).send({
		message: `Route ${request.raw.method}:${request.url} not found`,
		error: 'Not Found',
		statusCode: 404,
	  });
	}
  });  

// defines port on which backend is listening (taken from .env file)
fastify.listen( {port: PORT, host:'0.0.0.0'}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});