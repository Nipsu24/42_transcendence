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

// Returns data for a single player
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

// Function to delete a player by ID
const deletePlayerById = async (id) => {
	return await prisma.player.delete({ where: { id: parseInt(id) } });
};

module.exports = {
	getAllPlayers,
	createPlayer,
	findPlayerById,
	deletePlayerById,
};