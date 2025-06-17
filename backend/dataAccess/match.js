const { PrismaClient } = require('@prisma/client');
const { findPlayerById } = require('./player');
const { findPlayerByName } = require('./player');
const prisma = new PrismaClient();

const createMatch = async (playerOneName, data) => {
// creates new match record
	const match = await prisma.match.create({
		data: {
			date: new Date().toISOString(),
			playerOneName: playerOneName, //passed as an extra argument, as not part of request body (data)
			playerTwoName: data.playerTwoName,
			resultPlayerOne: data.resultPlayerOne,
			resultPlayerTwo: data.resultPlayerTwo,
			aiOpponent: data.aiOpponent
		}
	});

	// attaches game to PlayerOne stats
	const playerOne = await findPlayerByName(playerOneName);
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

	// attaches match to PlayerTwo stat's (if PlayerTwo provided)
	if (data.playerTwoName) {
		const playerTwo = await findPlayerByName(data.playerTwoName);
		if (playerTwo) {
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