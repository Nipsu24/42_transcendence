const { playerBodySchema } = require('../schemas/player');
const Player = require('../models/player');

// helper function used in get 'all players' in order to return list of objects
// according to defined player schema
const arrayResponseSchema = (itemSchema) => ({
	response: {
		200: {
			type: 'array',
			items: itemSchema
		}
	}
});

// helper function used in get 'single player' in order to return player object
// according to defined player schema
const objectResponseSchema = (itemSchema) => ({
	response: { 200: itemSchema }
});

async function playerRoutes(fastify, options) {

// retrieves data from all available players
fastify.get('/api/players', {
    schema: arrayResponseSchema(playerBodySchema)
}, async (request, reply) => {
	try {
		const players = await Player.getAllPlayers({});
		reply.send(players);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching players' });
	}
});

// retrieves data for one particular player
fastify.get('/api/players/:id', {
    schema: objectResponseSchema(playerBodySchema)
}, async (request, reply) => {
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
fastify.post('/api/players', {
	schema: { body: playerBodySchema }
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

}

module.exports = playerRoutes;