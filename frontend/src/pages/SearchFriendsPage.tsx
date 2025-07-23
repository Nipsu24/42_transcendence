import React, { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../assets/default.png'
import { ErrorBanner } from '../components/ErrorBanner'
import { Friend, getMe, getAll, addFriend } from '../services/players'

interface FriendResult {
  id: number
  name: string
  avatar: string
  online: boolean
}

export default function SearchFriendsPage() {
  const navigate = useNavigate()

  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<FriendResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [myFriends, setMyFriends] = useState<Friend[]>([])
  const [myId, setMyId] = useState<number | null>(null)



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setServerError(null)
  }

  const handleSearch = async () => {
	const trimmed = query.trim()
	if (!trimmed) {
		setServerError('Please enter a friend name to search.')
		setResults([])
		return
	}

    setLoading(true)
    setServerError(null)
    try {
      // Fetch the full player list from the backend
      const allPlayers = await getAll()
      // Filter only the entries whose names include the search query
      const filtered = allPlayers
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) && p.id !== myId)
        .map(p => {
		  const myFriend = myFriends.find(f => f.id === p.id)
          return {
			id: p.id,
          	name: p.name,
          	avatar: p.avatar ?? defaultAvatar,
          	online: myFriend?.online ?? p.online ?? false,
		  }
        })
      setResults(filtered)
	  if (filtered.length === 0) {
		setServerError(`No players found. Try a different name?`)
	  }
    } catch (err) {
      setServerError((err as Error).message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (name: string) => {
    setServerError(null)
    try {
      // Call the API to add a friend
      await addFriend(name)
	  // Fetch your updated profile (including the new friends list)
	  const me = await getMe()
	  setMyFriends(me.friends ?? [])
      // On success, remove the player from the search results
	  alert(`${name} is now your friend!`)
    } catch (err) {
      setServerError((err as Error).message)
    }
  }
  useEffect(() => {
	const fetchMyFriends = async () => {
	  try {
		const me = await getMe()
		setMyFriends(me.friends ?? [])
		setMyId(me.id)
	  } catch (error) {
		console.error('Failed to fetch my friends:', error)
	  }
	}
	fetchMyFriends()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* CLOSE */}
      <button
        onClick={() => navigate('/friends')}
		className="absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
      >
        × CLOSE
      </button>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-md p-8 space-y-8">
        {/* Search */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src={defaultAvatar}
            alt="Default avatar"
            className="w-40 h-40 rounded-3xl bg-gray-100 object-cover"
          />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search friends by name"
			className="font-body tracking-wider text-gray-500 w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
			/>

          {serverError && <ErrorBanner message={serverError} />}

          <button
            onClick={handleSearch}
			className="w-full max-w-md px-6 py-3 bg-gray-800 hover:bg-[#FE8915] text-white font-heading tracking-wider rounded-lg transition"
			>
			Search
          </button>
		  <p className="text-center font-body tracking-wider text-gray-500 text-sm">
            Enter a friend’s name and add them to your list!
          </p>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-2xl font-heading font-semibold text-gray-800 px-2">
              Search Results
            </h2>
            <div className="overflow-y-auto max-h-[40vh] border rounded-lg">
				<table className="table-fixed w-full text-left font-body text-gray-700">
                	<thead className="bg-gray-100 sticky top-0">
                  	<tr>
					  <th className="px-5 w-2/3 p-2">Player</th>
                    	<th className="w-1/3 p-2">Action</th>
                  	</tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
					const isAlreadyFriend = myFriends.some(f => f.id === r.id) 
					return (
                    <tr
                      key={r.id}
                      className={`border-t last:border-b-0 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-2 flex items-center space-x-3">
                        <img
                          src={r.avatar}
                          alt={`${r.name}'s avatar`}
                          className="w-8 h-8 rounded-full object-cover"
						  onError={(e) => {
							const target = e.currentTarget
							if (target.src !== defaultAvatar) {
							  target.src = defaultAvatar
							}
						  }}
                        />
                        <span className="font-body font-medium text-gray-800">{r.name}</span>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            r.online ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                          title={r.online ? 'Online' : 'Offline'}
                        />
                      </td>
                      <td className="p-2">
					  {isAlreadyFriend ? (
						<span className="text-xs font-body text-gray-500">Already friend</span>
					  ) : (
						<button
						onClick={() => handleAdd(r.name)}
                          className="px-2 py-1 text-xs font-body border border-gray-800 rounded hover:bg-gray-700 hover:text-white transition"
                        >
                          Add
                        </button>
					  )}
                      </td>
                    </tr>
					)
				 })}
                </tbody>
              </table>
            </div>
          </div>
		)}
      </div>
    </div>
  )
}
