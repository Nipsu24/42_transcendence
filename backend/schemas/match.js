// defines structure of the match object (fetched within player's stats object)
const matchBodySchema = {
	type: 'object',
	required: ['date', 'playerOne', 'resultPlayerOne', 'resultPlayerTwo', 'aiOpponent'],
	properties: {
		id: { type: 'integer', minimum: 1},
		date: { type: 'string' },
		playerOne: { type: 'integer'},
		playerTwo: { type: 'integer'},
		resultPlayerOne: { type: 'integer', minimum: 0},
		resultPlayerTwo: { type: 'integer', minimum: 0},
		aiOpponent: { type: 'boolean'},
	},
	additionalProperties: false
};

module.exports = { matchBodySchema };