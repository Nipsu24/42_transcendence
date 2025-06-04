const playerBodySchema = {
	type: 'object',
	required: ['name', 'password'],
	properties: {
		name: { type: 'string' },
		password: { type: 'string' },
		e_mail: { type: 'string' },
		online: { type: 'boolean'},
		stats: {
			type: 'object',
			properties: {
				victories: { type: 'integer' },
				defeats: { type: 'integer' },
				matches: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							date: { type: 'string' },
							playerOne: { type: 'integer'},
							playerTwo: { type: 'integer'},
							resultPlayerOne: { type: 'integer'},
							resultPlayerTwo: { type: 'integer'},
						},
						additionalProperties: false
					}
				}
			},
			additionalProperties: false
		},
		friends: {
			type: 'array',
			items: { type: 'integer' }
		},
	},
	additionalProperties: false
};

module.exports = { playerBodySchema };