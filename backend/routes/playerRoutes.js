const { playerBodySchema } = require('../schemas/player');
const { playerReqInfoSchema } = require('../schemas/player');
const { statsResSchema } = require('../schemas/stats');
const { statsReqSchema } = require('../schemas/stats');
const { matchRequestBodySchema } = require('../schemas/match');
const { matchResponseSchema } = require('../schemas/match');
const { friendsBodySchema } = require('../schemas/friend');
const Player = require('../dataAccess/player');
const Stats = require('../dataAccess/stats');
const Match = require('../dataAccess/match');
const { authenticate } = require('./login');
const { arrayResponseSchema, objectResponseSchema, putReqResSchema, postReqResSchema, postDivReqResSchema, putDivReqResSchema } = require('./schemaHelpers');
//used for image upload:
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');
//


// imports player apis from './routes/playerRoutes.js, 
// hook for checking each api call for valid JWT token via 'authenticate' function
async function playerRoutes(fastify, options) {
	fastify.addHook('onRequest', authenticate);
/*######################################## Player ######################################## */

// retrieves data from all available players
fastify.get('/api/players', arrayResponseSchema(playerBodySchema), async (request, reply) => {
	try {
		const players = await Player.getAllPlayers({});
		reply.send(players);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching players.' });
	}
});

// retrieves data for one particular logged in player
fastify.get('/api/players/me', objectResponseSchema(playerBodySchema), async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found'});
		reply.send(player);
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while fetching the player.' });
	}
});

// handles deletion of player (also removes friends connections 
// and resp. match stats in case no other player of the match exists anymore)
fastify.delete('/api/players/me', async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.'});
		await Player.deletePlayerById(id);
		reply.status(204).send();
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while deleting the player.' });
	}
});

// updates player info (name or e-mail, both at the same time not possible)
fastify.put('/api/players/me', putDivReqResSchema(playerReqInfoSchema, playerBodySchema), async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		const { name, e_mail, avatar } = request.body;
		if (name) {
			const foundPlayerByName = await Player.findPlayerByName(name);
			if (!foundPlayerByName || foundPlayerByName.id === player.id) {
				const updatedPlayerInfo = await Player.updatePlayerInfo({
					id: player.id,
					name
				})
				reply.send(updatedPlayerInfo);
			}
			else
				return reply.status(404).send({ error: 'Name is not available anymore.' });
		}
		if (e_mail) {
			const foundPlayerByEMail = await Player.findPlayerByEMail(e_mail);
			if (!foundPlayerByEMail || foundPlayerByEMail.id === player.id) {
				const updatedPlayerInfo = await Player.updatePlayerInfo({
					id: player.id,
					e_mail
				})
				reply.send(updatedPlayerInfo);
			}
			else
				return reply.status(404).send({ error: 'E-mail is not available anymore.' });
		}
		// NEW!! 
		// new added code for updating avatar
		if (avatar) {
			const updatedPlayerInfo = await Player.updatePlayerInfo({
				id: player.id,
				avatar
			})
			reply.send(updatedPlayerInfo);
		}
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while updating the player information.' });
	}
})

/*######################################## Stats ######################################## */
// ************************************DEPRICATED, NO LONGER NEEDED******************************************
// updates stats of a single player and the player's opponent
fastify.put('/api/players/me/stats', putDivReqResSchema(statsReqSchema, statsResSchema), async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		const { victories, defeats, opponentName, opponentVictories, opponentDefeats } = request.body;
		const updateStats = await Stats.updateStats({
			id: player.stats.id,
			victories,
			defeats
		});
		if (opponentName) {
			const opponent = await Player.findPlayerByName(opponentName);
			if (opponent) {
				await Stats.updateStats({
					id: opponent.stats.id,
					victories: opponentVictories,
					defeats: opponentDefeats
				});
			}
		}
		reply.send(updateStats);
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while updating the statistics.' });
	}
});
//***************************************************************************************************************** */

/*######################################## Match ######################################## */

// creates new match record and 'attaches' this to the participating players' statistics
// also updates victory/defeat statistics of participating players
// playerOneName is always to be provided, whereby playerTwoName only in case it is not an AI game
fastify.post('/api/players/me/matches', postDivReqResSchema(matchRequestBodySchema, matchResponseSchema), async (request, reply) => {
	try {
		const playerOne = await Player.findPlayerByName(request.body.playerOneName); 
		if (!playerOne) {
			return reply.status(404).send({ error: 'PlayerOne not found.' });
		}

		const { playerTwoName, resultPlayerOne, resultPlayerTwo, aiOpponent } = request.body;

		let playerTwo = null;
        if (playerTwoName && !aiOpponent) {
            playerTwo = await Player.findPlayerByName(playerTwoName);
            if (!playerTwo) {
                return reply.status(404).send({ error: 'PlayerTwo not found.' });
            }
        }

		const newMatch = await Match.createMatch({
			playerOneName: playerOne.name,
			playerTwoName, 
			resultPlayerOne, 
			resultPlayerTwo, 
			aiOpponent
		});

		// Updates stats based on match result
        const playerOneWon = resultPlayerOne > resultPlayerTwo;
        
        // Update playerOne stats
        await Stats.updateStats({
            id: playerOne.stats.id,
            victories: playerOne.stats.victories + (playerOneWon ? 1 : 0),
            defeats: playerOne.stats.defeats + (playerOneWon ? 0 : 1)
        });

        // Update playerTwo stats (if not AI)
        if (playerTwo) {
            await Stats.updateStats({
                id: playerTwo.stats.id,
                victories: playerTwo.stats.victories + (playerOneWon ? 0 : 1),
                defeats: playerTwo.stats.defeats + (playerOneWon ? 1 : 0)
            });
        }

        reply.status(201).send(newMatch);
    }

	catch (error) {
		reply.status(500).send({ error: 'An error occured while creating the match records.' });
		console.log('error:', { error });
	}
})

/*######################################## Friends ######################################## */

// adds friend to array of friends (for both sides -  player and friend)
// takes friend name as argument, checks if friend is existing and not yet added as friend
// and then calls resp. data access function
fastify.post('/api/players/me/friends', postReqResSchema(friendsBodySchema), async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		if (player.name === request.body.name)
			return reply.status(404).send({ error: 'Cannot add yourself as friend.' });
		const friend = await Player.findPlayerByName(request.body.name);
		if (!friend)
			return reply.status(404).send({ error: 'Friend not found.' });
		if (player.friends.some(f => f.id === friend.id))
			return reply.status(404).send({ error: `Friend ${friend.name} already added as a friend.` });
		else {
			await Player.addFriend(id, friend.id);
			reply.status(201).send({ name: friend.name, online: friend.online });
		}
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while adding a friend.' });
	}
})

// deletes friend from friend array (for both sides - player and friend)
fastify.delete('/api/players/me/friends', async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		const friend = await Player.findPlayerByName(request.body.name);
		if (!friend)
			return reply.status(404).send({ error: 'Friend not found.' });
		else {
			await Player.deleteFriend(id, friend.id);
			reply.status(201).send({ message: `Friend ${friend.name} deleted successfully.` });
		}
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while deleting a friend.' });
	}
})

/*######################################## Avatar ######################################## */

// MODIFIED!! 
// create 'uploads' folder in backend side (with 'assets' name somehow coundn't make it work)..
// enables upload of avatar image into './uploads' folder - new code for this part in index.js too 
// using request.file() instead for e.g. request.file('avatar') accepts any name for field name
fastify.post('/api/players/me/upload', async (request, reply) => {
	try {
		const pump = util.promisify(pipeline);
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		
		const data = await request.file();
		const filePath = `./uploads/${data.filename}`;
        await pump(data.file, fs.createWriteStream(filePath));
		await Player.updateAvatar(id, filePath);
		return reply.status(200).send({url: `/uploads/${data.filename}`})
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while uploading the image.' });
	}
})


fastify.put('/api/players/me/logout', async (request, reply) => {
	try {
		const id = request.user.id;
		const player = await Player.findPlayerById(id);
		if (!player)
			return reply.status(404).send({ error: 'Player not found.' });
		await Player.setPlayerOffline(player);
		return reply.status(200).send({ message: 'User logged out successfully.'});
	}
	catch (error) {
		reply.status(500).send({ error: 'An error occured while logging out.' });
	}
})

}

module.exports = playerRoutes;