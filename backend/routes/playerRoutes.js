const { playerBodySchema } = require('../schemas/player');
const { statsBodySchema } = require('../schemas/stats');
const Player = require('../models/player');
const { arrayResponseSchema, objectResponseSchema, putReqResSchema, postReqResSchema } = require('./schemaHelpers');

// imports player apis from './routes/playerRoutes.js'
async function playerRoutes(fastify, options) {

// retrieves data from all available players
fastify.get('/api/players', arrayResponseSchema(playerBodySchema), async (request, reply) => {
	try {
		const players = await Player.getAllPlayers({});
		reply.send(players);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching players' });
	}
});

// retrieves data for one particular player
fastify.get('/api/players/:id', objectResponseSchema(playerBodySchema), async (request, reply) => {
	try {
		const id = Number(request.params.id);
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
// uses player schema (from schemas dir) and automatically calls 
// error handler function in case request body does not match with defined schema
fastify.post('/api/players', postReqResSchema(playerBodySchema), async (request, reply) => {
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

// updates stats of a single player
fastify.put('/api/players/:id/stats', putReqResSchema(statsBodySchema), async (request, reply) => {
	try {
		const id = Number(request.params.id);
		const player = await Player.findPlayerById(id);
		if (!player) {
			return reply.status(404).send({ error: 'Player not found'});
		}
		const { victories, defeats } = request.body;
		const updateStats = await Player.updateStats({
			id: player.stats.id,
			victories,
			defeats
		});
		reply.send(updateStats);
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while updating the statistics' });
	}
});

}

module.exports = playerRoutes;