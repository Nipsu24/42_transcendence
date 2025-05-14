import axios from 'axios'
const baseUrl = 'api/players'
// const baseUrl = 'http://localhost:3001/players'
// const baseUrl = 'http://localhost:3001/gamers'

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