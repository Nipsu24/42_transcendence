const { playerBodySchema } = require('./player');

const LoginReqSchema = {
	type: 'object',
	required: ['e_mail', 'password'],
	properties: {
		e_mail: { type: 'string' },
		password: { type: 'string' },
	},
	additionalProperties: false
};

const LoginResSchema = {
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

module.exports = { LoginReqSchema, LoginResSchema };