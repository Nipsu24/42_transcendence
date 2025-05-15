import axios from 'axios'

//COMMENT BASEURL IN/OUT DEPENDING ON TESTING
//IF WORKING WITH REAL BACKEND, USE 'api/...' IF WORKING WITH JSON BACKEND USE OTHER

const baseUrl = 'api/players'
// const baseUrl = 'http://localhost:3001/players'
// const baseUrl = 'http://localhost:3001/gamers'


//Following are service functions that use the axios http client
//These functions are used in the App.jsx file's app component in order to submit requests to the backend
const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}  

const create = newObject => {
	const request = axios.post(baseUrl, newObject)
	return request.then(response => response.data)
}

const update = (id, updatedObject) => {
	const request = axios.put(`${baseUrl}/${id}`, updatedObject);
	return request.then(response => response.data);
};

const remove = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(response => response.data)
}

export default { getAll, create, update, remove }