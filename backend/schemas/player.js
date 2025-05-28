const playerBodySchema = {
  type: 'object',
  required: ['name', 'password'],
  properties: {
    name: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false
};

module.exports = { playerBodySchema };