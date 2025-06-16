const { playerBodySchema } = require('../schemas/player');
const { statsBodySchema } = require('../schemas/stats');
const { matchRequestBodySchema } = require('../schemas/match');
const { matchResponseSchema } = require('../schemas/match');
const { friendsReqSchema } = require('../schemas/friend');
const { friendsResSchema } = require('../schemas/friend');
const { friendsBodySchema } = require('../schemas/friend');
const Player = require('../dataAccess/player');
const Stats = require('../dataAccess/stats');
const Match = require('../dataAccess/match');
const { arrayResponseSchema, objectResponseSchema, putReqResSchema, postReqResSchema, postDivReqResSchema } = require('./schemaHelpers');

// imports player apis from './routes/playerRoutes.js'
async function playerRoutes(fastify, options) {

/*######################################## Player ######################################## */

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
		if (!player)
			return reply.status(404).send({ error: 'Player not found'});
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
		const allPlayers = await Player.getAllPlayers();
		if (allPlayers.some(p => p.name === request.body.name))
			return reply.status(404).send({ error: 'Name is not available anymore' });
		const newPlayer = await Player.createPlayer(request.body);
		reply.status(201).send(newPlayer);
	} 
	catch (error) {
		console.log('error:', (error));
		reply.status(500).send({ error: 'An error occurred while creating the player' });
	}
});

// handles deletion of player
fastify.delete('/api/players/:id', async (request, reply) => {
	try {
		const id = Number(request.params.id);
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found'});
		await Player.deletePlayerById(id);
		reply.status(204).send();
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while deleting the player' });
	}
});

/*######################################## Stats ######################################## */

// updates stats of a single player
fastify.put('/api/players/:id/stats', putReqResSchema(statsBodySchema), async (request, reply) => {
	try {
		const id = Number(request.params.id);
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found' });
		const { victories, defeats } = request.body;
		const updateStats = await Stats.updateStats({
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

/*######################################## Match ######################################## */

// creates new match record and 'attaches' this to the participating players' statistics
// playerOne name is retrieved via player id, whereby playerTwoName is to be provided in the request body
fastify.post('/api/players/:id/matches', postDivReqResSchema(matchRequestBodySchema, matchResponseSchema), async (request, reply) => {
	try {
		const playerOneId = Number(request.params.id);
		const playerOne = await Player.findPlayerById(playerOneId);
		if (!playerOne) {
			return reply.status(404).send({ error: 'PlayerOne not found' });
		}
		if (request.body.playerTwoName) {
			const playerTwo = await Player.findPlayerByName(request.body.playerTwoName);
			if (!playerTwo) {
				return reply.status(404).send({ error: 'PlayerTwo not found' });
			}
		}
		const { playerTwoName, resultPlayerOne, resultPlayerTwo, aiOpponent } = request.body;
		const newMatch = await Match.createMatch(playerOne.name, {
			playerTwoName, 
			resultPlayerOne, 
			resultPlayerTwo, 
			aiOpponent
		})
		reply.status(201).send(newMatch);
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while creating the match records' });
	}
})

// adds friend to array of friends (for both sides -  player and friend)
// takes friend name as argument, checks if friend is existing and not yet added as friend
// and then calls resp. data access function
fastify.post('/api/players/:id/friends', postReqResSchema(friendsBodySchema), async (request, reply) => {
	try {
		const id = Number(request.params.id);
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found' });
		if (player.name === request.body.name)
			return reply.status(404).send({ error: 'Cannot add yourself as friend' });
		const friend = await Player.findPlayerByName(request.body.name);
		if (!friend)
			return reply.status(404).send({ error: 'Friend not found' });
		if (player.friends.some(f => f.id === friend.id))
			return reply.status(404).send({ error: `Friend ${friend.name} already added as a friend.` });
		else {
			await Player.addFriend(id, friend.id);
			reply.status(201).send({ name: friend.name, online: friend.online });
		}
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while adding a friend' });
	}
})

// deletes friend from friend array (for both sides - player and friend)
fastify.delete('/api/players/:id/friends', async (request, reply) => {
	try {
		const id = Number(request.params.id);
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found' });
		const friend = await Player.findPlayerByName(request.body.name);
		if (!friend)
			return reply.status(404).send({ error: 'Friend not found' });
		else {
			await Player.deleteFriend(id, friend.id);
			reply.status(201).send({ message: `Friend ${friend.name} deleted successfully.` });
		}
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while deleting a friend' });
	}
})

}

module.exports = playerRoutes;