require('dotenv').config()
const fastify = require('fastify')({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: false // Ensures extra fields like "test" trigger validation errors
    }
  }
});
const Player = require('./models/player')
const PORT = parseInt(process.env.PORT, 10) || 3000;
const path = require('path');
const fastifyStatic = require('fastify-static');
const { playerBodySchema } = require('./schemas/player');

fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'dist'),
	prefix: '/',
});

fastify.get('/api/players', async (request, reply) => {
	try {
		const players = await Player.getAllPlayers({});
		reply.send(players);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching players' });
	}
});

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


fastify.setErrorHandler((error, request, reply) => {
  // Check for validation errors
  if (error.validation) {
    reply.status(400).send({ error: 'Invalid player data: name and password are required, no extra fields allowed.' });
  } else {
    // Default error handling
    reply.status(500).send({ error: 'An internal server error occurred.' });
  }
});

fastify.listen( {port: PORT}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});