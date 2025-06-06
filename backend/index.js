require('dotenv').config()
const fastify = require('fastify')({ logger: true });
const Player = require('./models/player')
const PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fastifyStatic = require('fastify-static');
const { playerBodySchema } = require('./schemas/player');
const { log } = require('console');

// needed for handling static frontend files in test environment (not needed for production)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'dist'),
	prefix: '/',
});

// handles get requests for player data
// fastify.get('/api/players', async (request, reply) => {
// 	try {
// 		const players = await Player.getAllPlayers({});
// 		reply.send(players);
// 	} 
// 	catch (error) {
// 		reply.status(500).send({ error: 'An error occurred while fetching players' });
// 	}
// });

// handles get requests for player data
fastify.get('/api/players/:id', async (request, reply) => {
	try {
		const id = Number(request.params.id);
		console.log('Fetched ID:', id);
		const player = await Player.findPlayerById(id);
		if (!player) {
			return reply.status(404).send({ error: 'Player not found'});
		}
		reply.send(player);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching the player' });
	}
});

// handles adding a new player to the database
// uses player schema (from schemas dir) and automatically calls error handler function in case 
// request body does not match with defined schema
fastify.post('/api/players', {
	schema: {
		body: playerBodySchema
	}
}, async (request, reply) => {
	try {
		const newPlayer = await Player.createPlayer(request.body);
		reply.status(201).send(newPlayer);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while creating the player' });
	}
});

// handles deletion of player
fastify.delete('/api/players/:id', async (request, reply) => {
	try {
		const id = Number(request.params.id);
		await Player.deletePlayerById(id);
		reply.status(204).send();
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while deleting the player' });
	}
});

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