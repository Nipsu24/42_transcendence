import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_BASE_URL!

export interface Player {
	id: string;
	name: string;
	email: string;
	password: string;
  }

export const getAll = (): Promise<Player[]> => {
  return axios.get<Player[]>(baseUrl).then(res => res.data)
}

export const create = (
	newPlayer: Omit<Player, 'id'>
  ): Promise<Player> => {
	return axios.post<Player>(baseUrl, newPlayer).then(res => res.data)
  }

export const update = (
	id: string,
	updatedPlayer: Partial<Player>
  ): Promise<Player> => {
	return axios
	  .put<Player>(`${baseUrl}/${id}`, updatedPlayer)
	  .then(res => res.data)
  }

export const remove = (id: string): Promise<void> => {
  return axios.delete<void>(`${baseUrl}/${id}`).then(() => {})
}

export default { getAll, create, update, remove }

// baseUrl gets automatically adjusted depending on makefile command.
// URL is:
// http://localhost:3001/players (for all frontend tests when testing with JSON-backend) or 
// api/players (when testing with real backend in the backend tests section)
//Following are service functions that use the axios http client
//These functions are used in the App.jsx file's app component in order to submit
// requests to the backend (or the JSON-server for testing purposes)