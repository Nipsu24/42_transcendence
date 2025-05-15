import { useState, useEffect } from 'react'
import playerService from './services/players'
import Notification from './components/Notification'
import ErrMsg from './components/ErrorMsg'

//!!usually good practice to create individual files for each of the following 3 components in dir 'components'!!

//Player component, called in RegisteredPlayers component
const Player = ({ player, deletePlayer }) => {
	return (
		<div>
			{player.name}
			<button onClick={deletePlayer}>
				delete
			</button>
		</div>
	)
  }

//Component which defines the two input fields on the website
const PlayerForm = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>
				name: <input 
				value={props.newName}
				onChange={props.onNameChange}/>
			</div>
			<div>
				password: <input 
				value={props.newPassword}
				onChange={props.onPasswordChange}/>
				</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

//displayes all registered players on website, map method used to loop through players array 
// (map has different functionality in javascript as e.g. in c++)
const RegisteredPlayers = ({players, deletePlayer}) => {
	return (
		<div>
			{players.map(player => (
				<Player 
					key={player.id}
					player={player}
					deletePlayer={() => deletePlayer(player.id)}
				/>
			))}
		</div>
	)
}

//root component, manages overall structure and state of application
const App = () => {
	const [players, setPlayers] = useState([])
	const [newName, setNewName] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [successMessage, setSuccessMessage] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	
	//Initially renders all available players, empty [] so that it only runs once
	useEffect(() => {
		playerService
		.getAll()
		.then(initialPlayers => {
			setPlayers(initialPlayers)
		})
	}, [])

	//creates a new player object and sends it to backend via create (axios.post from players.js file)
	//setPlayers triggers new rendering of displayed players / updates players state
	const addPlayer = (event) => {
		event.preventDefault()
		const newPlayerObject = {
			name: newName,
			password: newPassword,
		}
		playerService
		.create(newPlayerObject)
		.then(returnedPlayer => {
			setPlayers(players.concat(returnedPlayer))
			setSuccessMessage(`Added ${newName}.`)
			setTimeout(() => {
				setSuccessMessage(null)
			}, 5000)
			setNewName('')
			setNewPassword('')
		})
		.catch(error => {
			console.log(error.response.data.error)
			setErrorMessage(error.response.data.error)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		})
	}
	
	//triggers rerendering of name input field / updates newName state
	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}
	
	//triggers rerendering of password input field / updates newPassword state
	const handlePasswordChange = (event) => {
		console.log(event.target.value)
		setNewPassword(event.target.value)
	}

	//deletes player by using remove (axios.delete from players.js file)
	const deletePlayer = (id) => {
		const player = players.find(p => p.id === id)
		if (window.confirm(`Delete ${player.name}?`)) {
			playerService
			.remove(id)
			.then(() => {
				setPlayers(players.filter(p => p.id != id))
			})
			.catch(error => {
				setErrorMessage(`${player.name} was already deleted from the server`)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setPlayers(players.filter(p => p.id !== id))
			})
		}
	}

	return (
		<div>
			<h1>Transcendental Pong</h1>
			<Notification message={successMessage} />
			<ErrMsg message={errorMessage} />
			<h2>register a new player</h2>
			<PlayerForm 
				newName={newName} 
				onNameChange={handleNameChange} 
				newPassword={newPassword} 
				onPasswordChange={handlePasswordChange} 
				onSubmit={addPlayer}
			/>
			<h2>List of players</h2>
			<RegisteredPlayers 
				players={players}
				deletePlayer={deletePlayer}
			/>
		</div>
	)
}

export default App
