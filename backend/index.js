require('dotenv').config()
const fastify = require('fastify')({ logger: true });
const PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fastifyStatic = require('@fastify/static');
const playerRoutes = require('./routes/playerRoutes');
const { log } = require('console');
const multipart = require('@fastify/multipart');

// needed for handling static frontend files in test environment (not needed for production)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'dist'),
	prefix: '/',
});

//imports code from the player apis (./routes/playerRoutes.js)
fastify.register(multipart);
fastify.register(playerRoutes);

// handles errors (e.g. if post request payload not according to schema)
// does not throw error if additional fields not defined by schema are sent, as they are automatically ignored by fastify ajv
fastify.setErrorHandler((error, request, reply) => {
	if (error.validation) {
		if (request.routerPath === '/api/players' && request.method === 'POST')
			reply.status(400).send({ error: 'Invalid player data: name and password are required, no extra fields allowed.' });
		else if (request.routerPath === '/api/players/:id/stats' && request.method === 'PUT')
			reply.status(400).send({ error: 'Invalid player data: victory and defeats are required, min. 0, max 1000' });
		else if (request.routerPath === '/api/players/:id/matches' && request.method === 'POST')
			reply.status(400).send({ error: 'Invalid match data: resultPlayerOne, resultPlayerTwo and aiOpponent are required. Results need to be <= 10' });
		else if (request.routerPath === '/api/players/:id/friends' && request.method === 'POST')
			reply.status(400).send({ error: 'Invalid friend data: "name" required.' });
		else if (request.routerPath === '/api/players/:id' && request.method === 'PUT')
			reply.status(400).send({ error: 'Invalid player info data: "name" and/or "e-mail" required.' });
		else
			reply.status(400).send({ error: 'Invalid request data.' });
	} 
	else
		console.log('error:', (error));
		reply.status(500).send({ error: 'An internal server error occurred.' });
});

// defines port on which backend is listening (taken from .env file)
fastify.listen( {port: PORT, host:'0.0.0.0'}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});