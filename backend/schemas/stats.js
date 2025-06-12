// defines structure of the statistic object (fetched within player's object)
const statsBodySchema = {
	type: 'object',
	required: ['victories', 'defeats'],
	properties: {
		id: { type: 'integer'},
		victories: { type: 'integer', minimum: 0, maximum: 1000 },
		defeats: { type: 'integer', minimum: 0, maximum: 1000 },
	},
	additionalProperties: false
};

module.exports = { statsBodySchema };