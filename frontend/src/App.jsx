import { useState, useEffect } from 'react'
import axios from 'axios'
import playerService from './services/players'
import Notification from './components/Notification'
import ErrMsg from './components/ErrorMsg'

const Persons = ({ person, deletePerson }) => {
	return (
		<div>
			{person.name} {person.number} 
			<button onClick={deletePerson}>
				delete
			</button>
		</div>
	)
  }

const Filter = (props) => {
	return (
		<form>
			<div>
				filter shown with <input
				value={props.value}
				onChange={props.onChange}/>
			</div>
		</form>
	)
}

const PersonForm = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>
				name: <input 
				value={props.newName}
				onChange={props.onNameChange}/>
			</div>
			<div>
				password: <input 
				value={props.newNumber}
				onChange={props.onNumberChange}/>
				</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	const [successMessage, setSuccessMessage] = useState(null)
	const [ErrorMessage, setErrorMessage] = useState(null)
	
	useEffect(() => {
		playerService
		.getAll()
		.then(initialPersons => {
			setPersons(initialPersons)
		})
	}, [])

	const addName = (event) => {
		event.preventDefault()
		for (let i = 0; i < persons.length; i++) {
			if (newName === persons[i].name) {
				const updatedPerson = { ...persons[i], number: newNumber}
				playerService
				.update(persons[i].id, updatedPerson)
				.then(returnedPerson => {
					setPersons(persons.map(p => (p.id === persons[i].id ? returnedPerson : p)))
					setSuccessMessage(`Updated ${newName}.`)
					setNewName('');
                    setNewNumber('');
				})
				.catch(error => {
					console.log(error.response.data.error)
					setErrorMessage(error.response.data.error)
					setTimeout(() => {
						setErrorMessage(null)
					}, 5000)
				})
				return ;
			}
		}
		const newPersonObject = {
			name: newName,
			important: true,
			id: String(persons.length + 1),
			number: newNumber,
		}
		playerService
		.create(newPersonObject)
		.then(returnedPerson => {
			setPersons(persons.concat(returnedPerson))
			setSuccessMessage(`Added ${newName}.`)
			setTimeout(() => {
				setSuccessMessage(null)
			}, 5000)
			setNewName('')
			setNewNumber('')
		})
		.catch(error => {
			console.log(error.response.data.error)
			setErrorMessage(error.response.data.error)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		})
	}
	
	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}
	
	const filteredPersons = persons.filter(person =>
		person.name.toLowerCase().includes(filter.toLowerCase())
	)
	
	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}
	
	const deletePerson = (id) => {
		const person = persons.find(p => p.id === id)
		if (window.confirm(`Delete ${person.name}?`)) {
			playerService
			.remove(id)
			.then(() => {
				setPersons(persons.filter(p => p.id != id))
			})
			.catch(error => {
				setErrorMessage(`${person.name} was already deleted from the server`)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setPersons(persons.filter(p => p.id !== id))
			})
		}
	}
	
	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	const ShownPersons = ({filteredPersons, deletePerson}) => {
		return (
			<div>
				{filteredPersons.map(person => (
					<Persons 
						key={person.id}
						person={person}
						deletePerson={() => deletePerson(person.id)}
					/>
				))}
			</div>
		)
	}

	return (
		<div>
			<h1>Transcendental Pong</h1>
			<h2>Players</h2>
			<Notification message={successMessage} />
			<ErrMsg message={ErrorMessage} />
			<Filter value={filter} onChange={handleFilterChange} />
			<h2>register a new player</h2>
			<PersonForm 
				newName={newName} 
				onNameChange={handleNameChange} 
				newNumber={newNumber} 
				onNumberChange={handleNumberChange} 
				onSubmit={addName}/>
			<h2>List of players</h2>
			<ShownPersons 
				filteredPersons={filteredPersons}
				deletePerson={deletePerson} 
			/>
		</div>
	)
}

export default App
