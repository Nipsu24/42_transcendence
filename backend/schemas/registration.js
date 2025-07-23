const { playerBodySchema } = require('./player');

const RegistrationReqSchema = {
	type: 'object',
	required: ['name', 'e_mail', 'password'],
	properties: {
		name: { type: 'string' },
		password: { type: 'string' },
		e_mail: { type: 'string' },
	},
	additionalProperties: false
};

const RegistrationResSchema = {
	allOf: [
		playerBodySchema,
		{
		type: 'object',
		properties: {
			token: { type: 'string' }
		},
		required: ['token']
		}
	]
};

module.exports = { RegistrationReqSchema, RegistrationResSchema };