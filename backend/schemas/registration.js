const { playerBodySchema } = require('./player');

const RegistrationReqSchema = {
	type: 'object',
	required: ['name', 'e_mail'],
	properties: {
		name: { type: 'string' },
		password: { type: 'string' },
		e_mail: { type: 'string' },
	},
	additionalProperties: false,
	if: {
    properties: { auth: { const: 'google' } }
  },
  then: {
    required: ['name', 'e_mail'] // password not required for Google
  },
  else: {
    required: ['name', 'e_mail', 'password'] // password required for non-Google
  }
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