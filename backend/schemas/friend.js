// defines structure of the friends object (in course of adding/deleting a friend)
const friendsReqSchema = {
	type: 'object',
	required: ['name'],
	properties: {
		name: { type: 'string'},
	},
	additionalProperties: false
};

const friendsResSchema = {
	type: 'object',
	required: ['name', 'online'],
	properties: {
		name: { type: 'string' },
		online: { type: 'boolean' },
	},
	additionalProperties: false
};

const friendsBodySchema = {
	type: 'object',
	required: ['name'],
	properties: {
		name: { type: 'string' },
		online: { type: 'boolean' },
	},
	additionalProperties: false
};

module.exports = { friendsReqSchema, friendsResSchema, friendsBodySchema };