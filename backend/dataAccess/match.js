const { PrismaClient } = require('@prisma/client');
const { findPlayerById } = require('./player');
const prisma = new PrismaClient();

const createMatch = async (playerOneId, data) => {
// creates new match record
	const match = await prisma.match.create({
		data: {
			date: data.date,
			playerOne: playerOneId, //retrieved from params in post /api.../matches
			playerTwo: data.playerTwo,
			resultPlayerOne: data.resultPlayerOne,
			resultPlayerTwo: data.resultPlayerTwo,
			aiOpponent: data.aiOpponent
		}
	});

	// attaches game to player one stats
	const playerOne = await findPlayerById(playerOneId);
	if (playerOne && playerOne.stats) {
		await prisma.statistics.update({
			where: { id: playerOne.stats.id },
			data: {
				matches: {
					connect: { id: match.id },
				},
			},
		});
	}

	// attaches match to player two stat's, if player two provided
	if (data.playerTwo) {
		const playerTwo = findPlayerById(data.playerTwo);
		if (playerTwo && playerTwo.stats) {
			await prisma.statistics.update({
				where: { id: playerTwo.stats.id },
				data: {
					matches: {
						connect: { id: match.id },
					},
				},
			});
		}
	}

	return match;
}

module.exports = { createMatch }