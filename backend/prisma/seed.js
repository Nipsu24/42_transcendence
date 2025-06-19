const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.$executeRaw`PRAGMA foreign_keys=OFF;`;
    await prisma.$executeRaw`DELETE FROM Player;`;
    await prisma.$executeRaw`DELETE FROM Statistics;`;
    await prisma.$executeRaw`DELETE FROM Match;`;

    // Reset auto-increment counters
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Player';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Statistics';`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Match';`;

	// Re-enable foreign keys
    await prisma.$executeRaw`PRAGMA foreign_keys=ON;`;
}

async function main() {
	// clears existing data
	await clearDatabase();

	// Create statistics records
	const stats1 = await prisma.statistics.create({
		data: { victories: 5, defeats: 2 }
	});
	const stats2 = await prisma.statistics.create({
		data: { victories: 3, defeats: 4 }
	});
	const stats3 = await prisma.statistics.create({
		data: { victories: 7, defeats: 1 }
	});

  // Creates players with statsId referencing the statistics records
	const player1 = await prisma.player.create({
		data: {
		name: 'Player One',
		password: '23213',
		e_mail: 'one@example.com',
		online: true,
		avatar: './assets/img1.jpg',
		statsId: stats1.id
		}
	});
	const player2 = await prisma.player.create({
		data: {
		name: 'Player Two',
		password: 'password123',
		e_mail: 'two@example.com',
		online: false,
		avatar: './assets/img2.jpg',
		statsId: stats2.id
		}
	});
	const player3 = await prisma.player.create({
		data: {
		name: 'Player Three',
		password: 'qwerty',
		e_mail: 'three@example.com',
		online: true,
		avatar: './assets/img3.jpg',
		statsId: stats3.id
		}
	});

  	// Seeds friends
	await prisma.player.update({
		where: { id: player1.id },
		data: { friends: { connect: [{ id: player2.id }, { id: player3.id }] } }
	});

	// Seeds match data
	const match1 = await prisma.match.create({
		data: {
		playerOneName: player1.name,
		playerTwoName: player2.name,
		resultPlayerOne: 9,
		resultPlayerTwo: 10,
		aiOpponent: false,
		statistics: {
			connect: [{ id: stats1.id }, { id: stats2.id }]
		}
		}
	});

	const match2 = await prisma.match.create({
		data: {
		playerOneName: player1.name,
		playerTwoName: player3.name,
		resultPlayerOne: 10,
		resultPlayerTwo: 7,
		aiOpponent: false,
		statistics: {
			connect: [{ id: stats1.id }, { id: stats3.id }]
		}
		}
	});
}


main()
.catch(e => console.error(e))
.finally(async () => {
	await prisma.$disconnect();
});

module.exports = { main, clearDatabase };