import React, { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../assets/Avatars/default.png'
import { ErrorBanner } from '../components/ErrorBanner'

interface FriendResult {
  id: string
  name: string
  avatar: string
  online: boolean
}

export default function SearchFriendsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<FriendResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    if (query.trim() === '') {
      setError('Please enter a search term.')
      setResults([])
      return
    }

    setError(null)
    setResults([
      { id: 'r1', name: 'Strawberry', avatar: defaultAvatar, online: true },
      { id: 'r2', name: 'Blueberry',  avatar: defaultAvatar, online: false },
      { id: 'r3', name: 'Cherry',     avatar: defaultAvatar, online: true },
    ])
  }

  const handleAdd = (name: string) => {
    alert(`Added ${name}!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* CLOSE */}
      <button
        onClick={() => navigate('/friends')}
        className="font-body absolute top-4 right-6 text-black text-sm font-medium hover:opacity-60 transition"
      >
        × CLOSE
      </button>

      {/* Card */}
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

          {/* error message */}
          {error && <ErrorBanner message={error} />}

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
                  {results.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-t last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="p-2 flex items-center space-x-3">
                        <img
                          src={r.avatar}
                          alt={`${r.name}'s avatar`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-body font-medium text-gray-800">{r.name}</span>
                        <span
                          className={`w-3 h-3 rounded-full ${r.online ? 'bg-green-500' : 'bg-gray-400'}`}
                          title={r.online ? 'Online' : 'Offline'}
                        />
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleAdd(r.name)}
                          className="px-2 py-1 text-xs font-body border border-gray-800 rounded hover:bg-gray-700 hover:text-white transition"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
