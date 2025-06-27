const fastify = require('fastify')({ logger: false });
const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');
const playerRoutes = require('../routes/playerRoutes');
const { main: seedDatabase, clearDatabase } = require('../prisma/seed');
const prisma = new PrismaClient();
const { playerBodySchema } = require('../schemas/player');
const { statsResSchema } = require('../schemas/stats');
const { matchResponseSchema } = require('../schemas/match');
const { friendsBodySchema } = require('../schemas/friend');
const Ajv = require('ajv'); // used for schema validation in test scope
const ajv = new Ajv();
const validatePlayerBody = ajv.compile(playerBodySchema);
const playersArraySchema = {
    type: 'array',
    items: playerBodySchema,
};
const validatePlayersArray = ajv.compile(playersArraySchema);
const validateStatsResSchema = ajv.compile(statsResSchema);
const validateMatchRes = ajv.compile(matchResponseSchema);
const validateFriendSchema = ajv.compile(friendsBodySchema);


let request; // Supertest instance

beforeAll(async () => {
    // Register routes
    await fastify.register(playerRoutes);

    // Start Fastify server
    await fastify.listen({ port: 3001, host: '127.0.0.1' });

    // Initialize Supertest with Fastify server
    request = supertest(fastify.server);
	
	await clearDatabase();
	await seedDatabase(); 
});

afterAll(async () => {
	await fastify.close(); // Ensure Fastify server is closed
	await prisma.$disconnect(); // Disconnect Prisma client
});


// tests GET for single player
test('GET /api/players/:id should return single player', async () => {
	const response = await request.get('/api/players/1'); // Use Supertest instance

	expect(response.status).toBe(200);
	// console.log('response body:', response.body);

	// Validate the response against the schema
	const isValid = validatePlayerBody(response.body);
	if (!isValid) {
		console.error(validatePlayerBody.errors); // Log validation errors
	}
	expect(isValid).toBe(true); // Assert that the response matches the schema
});


// tests GET for all players
test('GET /api/players should return all players', async () => {
	const response = await request.get('/api/players'); 

	expect(response.status).toBe(200);
	
	const isValid = validatePlayersArray(response.body);
	if (!isValid) {
		console.error(validatePlayersArray.errors); 
	}
	expect(isValid).toBe(true); 
});


// tests POST for a newly created player - success
test('POST /api/players should return a new created player object', async () => {
	const newPlayer = {
		name: 'Test Player',
		password: 'securepassword123'
	};
	const response = await request.post('/api/players')
	.send(newPlayer).set('Accept', 'application/json'); 

	expect(response.status).toBe(201);
	
	const isValid = validatePlayerBody(response.body);
	if (!isValid) {
		console.error(validatePlayerBody.errors); 
	}
	expect(isValid).toBe(true);
	expect(response.body).toHaveProperty('name', newPlayer.name)
});

// tests POST for a newly created player - failure
test('POST /api/players should return a new created player object', async () => {
	const newPlayer = {
		name: 'Player One',
		password: 'securepassword123'
	};
	const response = await request.post('/api/players')
	.send(newPlayer).set('Accept', 'application/json'); 

	expect(response.status).toBe(404);
	expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/Name is not available anymore/i);
});

// tests PUT for player stats (and player opponent's stats)
test('PUT /api/players/:id/stats should return updated stats for the respective player', async () => {
	const updatedStats = {
		victories: 5,
		defeats: 10,
		opponentName: 'Player Two',
		opponentVictories: 2,
		opponentDefeats: 3
	};
	const response = await request.put('/api/players/1/stats').
	send(updatedStats).set('Accept', 'application/json');

	expect(response.status).toBe(200);
	const isValid = validateStatsResSchema(response.body);
	if (!isValid) {
		console.error(validateStatsResSchema.errors); 
	}
	expect(isValid).toBe(true);
	expect(response.body).toHaveProperty('victories', updatedStats.victories);
})

// tests POST for new matches
test('POST /api/players/:id/matches should return the newly created match', async () => {
	const newMatch = {
		resultPlayerOne: 10,
		resultPlayerTwo: 2,
		aiOpponent: true
	};
	const response = await request.post('/api/players/1/matches').
	send(newMatch).set('Accept', 'application/json');

	expect(response.status).toBe(201);
	const isValid = validateMatchRes(response.body);
	if (!isValid) {
		console.error(validateMatchRes.errors); 
	}
	expect(isValid).toBe(true);
	expect(response.body).toHaveProperty('resultPlayerOne', newMatch.resultPlayerOne);
})

// tests POST for adding friends
test('POST /api/players/:id/friends should return added friend object', async () => {
	const newFriend = {
		name: 'Player Three'
	};
	const response = await request.post('/api/players/2/friends').
	send(newFriend).set('Accept', 'application/json');

	expect(response.status).toBe(201);
	const isValid = validateFriendSchema(response.body);
	if (!isValid) {
		console.error(validateFriendSchema.errors); 
	}
	expect(isValid).toBe(true);
	expect(response.body).toHaveProperty('name', newFriend.name);
})