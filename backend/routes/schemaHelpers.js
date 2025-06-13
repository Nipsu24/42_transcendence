// helper function used in e.g. get 'all players' in order to return list of objects
// according to defined player schema
const arrayResponseSchema = (itemSchema) => ({
	schema: {
		response: {
			200: {
				type: 'array',
				items: itemSchema
			}
		}
	}
});

// helper function used in get 'single player' in order to return player object
// according to defined player schema
const objectResponseSchema = (itemSchema) => ({
	schema: {
		response: { 200: itemSchema }
	}
});

// helper function that validates body of request and response of a put endpoint (e.g. PUT '/api/players/:id/stats)
const putReqResSchema = (itemSchema) => ({
	schema: {
		body: itemSchema,
		response: { 200: itemSchema }
	}
})

// helper function that validates body of request and response of a post endpoint (e.g. POST '/api/players')
const postReqResSchema = (itemSchema) => ({
	schema: {
		body: itemSchema,
		response: { 201: itemSchema }
	}
})

// helper function validating request body and response which vary from each other (e.g. used in
// create match where request does not need to contain playerTwo, but response return it as null)
const postDivReqResSchema = (reqSchema, resSchema) => ({
	schema: {
		body: reqSchema,
		response: { 201: resSchema}
	}
})

module.exports = {
	arrayResponseSchema,
	objectResponseSchema,
	putReqResSchema,
	postReqResSchema,
	postDivReqResSchema
};
