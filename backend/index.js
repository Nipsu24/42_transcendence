require('dotenv').config()
const fastify = require('fastify')({ logger: true });
const PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fastifyStatic = require('fastify-static');
const playerRoutes = require('./routes/playerRoutes');
const { log } = require('console');

// needed for handling static frontend files in test environment (not needed for production)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'dist'),
	prefix: '/',
});

//imports code from the player apis (./routes/playerRoutes.js)
fastify.register(playerRoutes);

// handles errors (e.g. if post request payload not according to schema)
// does not throw error if additional fields not defined by schema are sent, as they are automatically ignored by fastify ajv
fastify.setErrorHandler((error, request, reply) => {
	if (error.validation) {
		reply.status(400).send({ error: 'Invalid player data: name and password are required, no extra fields allowed.' });
	} 
	else {
		reply.status(500).send({ error: 'An internal server error occurred.' });
	}
});

// defines port on which backend is listening (taken from .env file)
fastify.listen( {port: PORT}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});