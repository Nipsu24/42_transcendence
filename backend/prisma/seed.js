const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function clearDatabase() {
    await prisma.$executeRaw`PRAGMA foreign_keys=OFF;`;
    await prisma.$executeRaw`DELETE FROM Statistics;`;
    await prisma.$executeRaw`DELETE FROM Player;`;
    await prisma.$executeRaw`DELETE FROM Match;`;
	await prisma.$executeRaw`DELETE FROM _PlayerFriends;`

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

	const hashedPassword1 = await bcrypt.hash('23213', 10);
	const hashedPassword2 = await bcrypt.hash('password123', 10);
	const hashedPassword3 = await bcrypt.hash('qwerty', 10);
	const hashedPassword4 = await bcrypt.hash('qwerty', 10);



  // Creates players with statsId referencing the statistics records
	const player1 = await prisma.player.create({
		data: {
		name: 'Player One',
		password: hashedPassword1,
		auth: 'local',
		e_mail: 'one@example.com',
		online: false,
		avatar: './assets/img1.jpg',
		statsId: stats1.id
		}
	});
	const player2 = await prisma.player.create({
		data: {
		name: 'Player Two',
		password: hashedPassword2,
			auth: 'local',
		e_mail: 'two@example.com',
		online: false,
		avatar: './assets/img2.jpg',
		statsId: stats2.id
		}
	});
	const player3 = await prisma.player.create({
		data: {
		name: 'Player Three',
		password: hashedPassword3,
			auth: 'local',
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

	// NEW!!
	// FROM HERE ADDITIONAL USERS AND MATCHES FOR TESTING

	// New statistics for Player Four
	const stats4 = await prisma.statistics.create({
		data: { victories: 3, defeats: 2 }
	});

	// Create Player Four
	const player4 = await prisma.player.create({
		data: {
			name: 'Gugu',
			password: hashedPassword4,
			auth: 'local',
			e_mail: 'gugu@hauhau.com',
			online: true,
			avatar: '/uploads/for_gugu.png',
			statsId: stats4.id
		}
	});

	// Additional users to serve as friends and opponents
	const extraStats = await Promise.all(
		Array.from({ length: 5 }, async (_, i) =>
			prisma.statistics.create({
				data: { victories: 2, defeats: 3 }
			})
		)
	)

	const avatarFilenames = [
		'1-C_iYpYSA.png',
		'2-BgCsig6a.png',
		'3-tvYe1b1u.png',
		'4-Dl6nFZco.png',
		'5-BSC5akPy.png'
	  ]
	  
	const extraPlayers = await Promise.all(
		extraStats.map((stat, i) =>
		  prisma.player.create({
			data: {
			  name: `Friend ${i + 1}`,
			  password: `pass${i + 1}`,
				auth: 'local',
			  e_mail: `friend${i + 1}@example.com`,
			  online: i % 2 === 0,
			  avatar: `./assets/${avatarFilenames[i]}`,
			  statsId: stat.id
			}
		  })
		)
	)
	  

	// Connect Player Four with the 5 new players as friends
	await prisma.player.update({
		where: { id: player4.id },
		data: {
			friends: {
				connect: extraPlayers.map(p => ({ id: p.id }))
			}
		}
	});

	// Seed 5 matches for Player Four
	await prisma.match.create({
		data: {
			playerOneName: player4.name,
			playerTwoName: extraPlayers[0].name,
			resultPlayerOne: 10,
			resultPlayerTwo: 8,
			aiOpponent: false,
			statistics: {
				connect: [{ id: stats4.id }, { id: extraPlayers[0].statsId }]
			}
		}
	})

	await prisma.match.create({
		data: {
			playerOneName: extraPlayers[1].name,
			playerTwoName: player4.name,
			resultPlayerOne: 9,
			resultPlayerTwo: 11,
			aiOpponent: false,
			statistics: {
				connect: [{ id: stats4.id }, { id: extraPlayers[1].statsId }]
			}
		}
	})

	await prisma.match.create({
		data: {
			playerOneName: player4.name,
			playerTwoName: extraPlayers[2].name,
			resultPlayerOne: 6,
			resultPlayerTwo: 10,
			aiOpponent: false,
			statistics: {
				connect: [{ id: stats4.id }, { id: extraPlayers[2].statsId }]
			}
		}
	})

	await prisma.match.create({
		data: {
			playerOneName: extraPlayers[3].name,
			playerTwoName: player4.name,
			resultPlayerOne: 10,
			resultPlayerTwo: 5,
			aiOpponent: false,
			statistics: {
				connect: [{ id: stats4.id }, { id: extraPlayers[3].statsId }]
			}
		}
	})

	await prisma.match.create({
		data: {
			playerOneName: player4.name,
			playerTwoName: extraPlayers[4].name,
			resultPlayerOne: 11,
			resultPlayerTwo: 9,
			aiOpponent: false,
			statistics: {
				connect: [{ id: stats4.id }, { id: extraPlayers[4].statsId }]
			}
		}
	})


// END OF NEW TEST DATA


}

main()
.catch(e => console.error(e))
.finally(async () => {
	await prisma.$disconnect();
});

module.exports = { main, clearDatabase };