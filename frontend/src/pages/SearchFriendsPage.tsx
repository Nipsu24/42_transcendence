import React, { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import defaultAvatar from '../assets/Avatars/default.png'

export default function SearchFriendsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    // TODO: call real search API here
    console.log('search for', query)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={() => navigate('/friends')}
        className="font-body tracking-wider absolute top-4 right-6 text-black font-medium text-sm hover:opacity-60 transition"
      >
        × CLOSE
      </button>

      <div className="font-body tracking-wider w-full max-w-md bg-white rounded-3xl shadow-md p-8 flex flex-col items-center space-y-6">
        {/* Center avatar display */}
        <img
          src={defaultAvatar}
          alt="Default avatar"
          className="w-40 h-40 rounded-3xl bg-gray-100 object-cover"
        />

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search friends by name"
          className="font-body tracking-wider w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          className="font-body tracking-wider w-full px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition"
        >
          Search
        </button>

        {/* Instruction text */}
        <p className="text-center text-gray-500 font-body text-sm">
          Enter a friend’s name and add them to your list!
        </p>
      </div>
    </div>
  )
}
