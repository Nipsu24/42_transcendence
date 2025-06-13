// defines structure of the match object (fetched within player's stats object)
const matchRequestBodySchema = {
	type: 'object',
	required: ['date', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		date: { type: 'string' },
		playerTwo: { type: ['integer', 'null'], minimum: 1}, // can be left away in case of Ai matches
		resultPlayerOne: { type: 'integer', minimum: 0, maximum: 10},
		resultPlayerTwo: { type: 'integer', minimum: 0, maximum: 10},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

const matchResponseSchema = {
	type: 'object',
	required: ['id', 'date', 'playerOne', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		id: { type: 'integer', minimum: 1},
		date: { type: 'string' },
		playerOne: { type: 'integer', minimum: 1},
		playerTwo: { type: ['integer', 'null'], minimum: 1 },
		resultPlayerOne: { type: 'integer', minimum: 0, maximum: 10},
		resultPlayerTwo: { type: 'integer', minimum: 0, maximum: 10},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

module.exports = { matchRequestBodySchema, matchResponseSchema };