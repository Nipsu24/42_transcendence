const Player = require('../dataAccess/player');
const { postDivReqResSchema } = require('./schemaHelpers');
const { RegistrationResSchema } = require('../schemas/registration');
const { RegistrationReqSchema } = require('../schemas/registration');

async function registrationRoute(fastify, options) {

// handles adding a new player to the database
// uses player schema (from schemas dir) and automatically calls error handler function 
// in case request body does not match with defined schema
fastify.post('/api/registration', postDivReqResSchema(RegistrationReqSchema, RegistrationResSchema), async (request, reply) => {
	try {
		const allPlayers = await Player.getAllPlayers();
		if (allPlayers.some(p => p.name === request.body.name || p.e_mail === request.body.e_mail))
			return reply.status(409).send({ error: 'Name or e-mail is not available anymore' });
		const newPlayer = await Player.createPlayer(request.body);
		const token = fastify.jwt.sign({ id: newPlayer.id, name: newPlayer.name },{ expiresIn: '1h' });
		
		reply.status(201).send({ ...newPlayer, token });
	} 
	catch (error) {
		reply.status(500).send({ error: 'An error occurred while creating the player' });
	}
});

}

module.exports = registrationRoute;