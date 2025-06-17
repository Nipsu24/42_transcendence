// defines structure of the friends object (in course of adding/deleting a friend)
const friendsBodySchema = {
	type: 'object',
	required: ['name'],
	properties: {
		name: { type: 'string' },
		online: { type: 'boolean' },
	},
	additionalProperties: false
};

module.exports = { friendsBodySchema };