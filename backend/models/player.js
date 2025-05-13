const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get all players
const getAllPlayers = async () => {
	return await prisma.player.findMany();
};

// Function to create a new player
const createPlayer = async (data) => {
	return await prisma.player.create({ data });
};

// Function to find a player by ID
const findPlayerById = async (id) => {
	return await prisma.player.findUnique({ where: { id: parseInt(id) } });
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