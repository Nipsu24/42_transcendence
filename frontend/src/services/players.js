import axios from 'axios'

// baseUrl gets automatically adjusted depending on makefile command.
// URL is:
// http://localhost:3001/players (for all frontend tests when testing with JSON-backend) or 
// api/players (when testing with real backend in the backend tests section)
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

//Following are service functions that use the axios http client
//These functions are used in the App.jsx file's app component in order to submit
// requests to the backend (or the JSON-server for testing purposes)
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