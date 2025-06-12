const statsBodySchema = {
	type: 'object',
	required: ['victories', 'defeats'],
	properties: {
		id: { type: 'integer'},
		victories: { type: 'integer' },
		defeats: { type: 'integer' },
	},
	additionalProperties: false
};

module.exports = { statsBodySchema };