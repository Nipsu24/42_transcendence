// defines structure of the match object (fetched within player's stats object)
const matchBodySchema = {
	type: 'object',
	required: ['date', 'playerOne', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		id: { type: 'integer', minimum: 1},
		date: { type: 'string' },
		playerOne: { type: 'integer', minimum: 1},
		playerTwo: { type: 'integer', minimum: 0},
		resultPlayerOne: { type: 'integer', minimum: 0, maximum: 10},
		resultPlayerTwo: { type: 'integer', minimum: 0, maximum: 10},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

module.exports = { matchBodySchema };