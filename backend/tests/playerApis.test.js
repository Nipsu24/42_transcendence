const fastify = require('fastify')({ logger: false });
const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');
const playerRoutes = require('../routes/playerRoutes');
const { main: seedDatabase, clearDatabase } = require('../prisma/seed');
const prisma = new PrismaClient();
const { playerBodySchema } = require('../schemas/player');
const Ajv = require('ajv'); // Import Ajv
const ajv = new Ajv(); // Initialize ajv
const validate = ajv.compile(playerBodySchema);

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

test('GET /api/players should return single player', async () => {
    const response = await request.get('/api/players/1'); // Use Supertest instance

    expect(response.status).toBe(200);
    // console.log('response body:', response.body);

    // Validate the response against the schema
    const isValid = validate(response.body);
    if (!isValid) {
        console.error(validate.errors); // Log validation errors
    }
    expect(isValid).toBe(true); // Assert that the response matches the schema
});