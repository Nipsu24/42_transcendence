// defines structure of the stats object for a request (used in put /api/players/:id/stats) 
const statsReqSchema = {
	type: 'object',
	required: ['victories', 'defeats'],
	properties: {
		id: { type: 'integer'},
		victories: { type: 'integer', minimum: 0, maximum: 1000 },
		defeats: { type: 'integer', minimum: 0, maximum: 1000 },
		opponentName: { type: ['string', 'null'] },
		opponentVictories: { type: ['integer', 'null'], minimum: 0, maximum: 1000 },
		opponentDefeats: { type: ['integer', 'null'], minimum: 0, maximum: 1000 },
	},
	additionalProperties: false
};

// defines structure of the stats object for a response (used in put /api/players/:id/stats)
// only returns relevant data for the player, not for the opponent
const statsResSchema = {
	type: 'object',
	required: ['victories', 'defeats'],
	properties: {
		id: { type: 'integer'},
		victories: { type: 'integer', minimum: 0, maximum: 1000 },
		defeats: { type: 'integer', minimum: 0, maximum: 1000 },
	},
	additionalProperties: false
};

module.exports = { statsReqSchema, statsResSchema };