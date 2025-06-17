const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Updates player statistics
const updateStats = async (data) => {
	return await prisma.statistics.update({
		where: { id: data.id },
		data: { 
			victories: data.victories,
			defeats: data.defeats,
		 },
	});
}

module.exports = { updateStats };