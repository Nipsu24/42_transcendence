const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Retrieves data of all players
const getAllPlayers = async () => {
	return prisma.player.findMany({
		include: {
			stats: {
				include: {
					matches: true
				}
			},
			friends: true
        }
    });
};

// Creates a new player
const createPlayer = async (data) => {
	const stats = await prisma.statistics.create({
		data: {victories: 0, defeats: 0},
	});
	return prisma.player.create({ 
		data: {
			...data,
			statsId: stats.id,
			avatar: './assets/pong_avatar.jpg',
		},
	});
};

// Returns data for a single player when passing the player's id
const findPlayerById = async (id) => {
	return prisma.player.findUnique({
		where: { id },
		include: {
			stats: {
				include: {
					matches: true,
				},
			},
			friends: {
				include: {
					stats: {
						include: {
							matches: true,
						},
					},
				},
			},
		},
	});
};

// Returns data for a single player when passing the player's name
const findPlayerByName = async (name) => {
	return prisma.player.findUnique({
		where: { name },
		include: {
			stats: {
				include: {
					matches: true,
				},
			},
		}
	});
};

// Function to delete a player by ID 
// and deletes any matches where all players have been already deleted
const deletePlayerById = async (id) => {
	await prisma.player.delete({ where: { id: parseInt(id) } });
	const existingPlayers = await prisma.player.findMany({ select: { name: true } });
	const allPlayerNames = existingPlayers.map(p => p.name);
	await prisma.match.deleteMany({
		where: {
			AND: [
				{ playerOneName: { notIn: allPlayerNames } },
				{ playerTwoName: { notIn: allPlayerNames } },
			],
		},
	});
	return
};

// adds friend to the friend list (for both player and friend)
const addFriend = async (playerId, friendId) => {
	await prisma.player.update({
		where: { id: playerId },
		data: { 
			friends: {
				connect: { id: friendId }
			}
		}
	})
	await prisma.player.update({
		where: { id: friendId },
		data: { 
			friends: {
				connect: { id: playerId }
			}
		}
	})
}

// deletes a friend from the list of friends (for both player and friend)
const deleteFriend = async (playerId, friendId) => {
	await prisma.player.update({
		where: { id: playerId },
		data: { 
			friends: {
				disconnect: { id: friendId }
			}
		}
	})
	await prisma.player.update({
		where: { id: friendId },
		data: { 
			friends: {
				disconnect: { id: playerId }
			}
		}
	})
}

module.exports = {
	getAllPlayers,
	createPlayer,
	findPlayerById,
	findPlayerByName,
	addFriend,
	deleteFriend,
	deletePlayerById,
};