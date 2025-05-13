require('dotenv').config()
const fastify = require('fastify')({ logger: true });
const Player = require('./models/player')
const PORT = parseInt(process.env.PORT, 10) || 3000;

fastify.get('/api/players', async (request, reply) => {
	try {
		const players = await Player.getAllPlayers({});
		reply.send(players);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching players' });
	}
});

fastify.post('/api/players', async (request, reply) => {
	try {
		const newPlayer = await Player.createPlayer(request.body);
		reply.status(201).send(newPlayer);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while creating the player' });
	}
});

fastify.listen( {port: PORT}, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server running at ${address}`);
});