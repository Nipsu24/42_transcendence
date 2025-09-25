// defines structure of the match object (fetched within player's stats object)
const matchRequestBodySchema = {
	type: 'object',
	required: ['playerOneName', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		playerOneName: { type: 'string' },
		playerTwoName: { type: ['string', 'null'] }, // can be left away in case of Ai matches
		resultPlayerOne: { type: 'integer', minimum: 0, maximum: 10},
		resultPlayerTwo: { type: 'integer', minimum: 0, maximum: 10},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

const matchResponseSchema = {
	type: 'object',
	required: ['id', 'date', 'playerOneName', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		id: { type: 'integer', minimum: 1},
		date: { type: 'string' },
		playerOneName: { type: 'string' },
		playerTwoName: { type: ['string', 'null'] },
		resultPlayerOne: { type: 'integer', minimum: 0, maximum: 10},
		resultPlayerTwo: { type: 'integer', minimum: 0, maximum: 10},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

module.exports = { matchRequestBodySchema, matchResponseSchema };