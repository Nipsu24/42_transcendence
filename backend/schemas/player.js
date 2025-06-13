// defines structure of the player object
const playerBodySchema = {
	type: 'object',
	required: ['name', 'password'],
	properties: {
		id: { type: 'integer', minimum: 1 },
		name: { type: 'string' },
		password: { type: 'string' },
		e_mail: { type: 'string' },
		online: { type: 'boolean'},
		avatar: { type: 'string' },
		stats: {
			type: 'object',
			properties: {
				id: { type: 'integer', minimum: 1 },
				victories: { type: 'integer', minimum: 0, maximum: 1000 },
				defeats: { type: 'integer', minimum: 0, maximum: 1000 },
				matches: {
					type: 'array',
					items: {
						type: 'object',
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
					}
				}
			},
			additionalProperties: false
		},
		friends: {
			type: 'array',
			items: { type: 'object',
				properties: {
					id: { type: 'integer' },
					name: { type: 'string' },
					online: { type: 'boolean' },
				}
			 }
		},
	},
	additionalProperties: false
};

module.exports = { playerBodySchema };