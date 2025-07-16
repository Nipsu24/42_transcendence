import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import defaultAvatar from '../assets/Avatars/default.png'

interface Match {
  id: string
  opponent: string
  date: string
  result: 'Win' | 'Loss'
}

interface Stats {
  wins: number
  losses: number
  matches: number
}

export default function MyPage() {
  const navigate = useNavigate()
  const username = 'Gugu'
  const email = 'Gugu@example.com'
  const [avatar] = useState<string | null>(null)
  const [stats] = useState<Stats>({ wins: 12, losses: 8, matches: 20 })

  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => {
    setMatches([
      { id: 'm1', opponent: 'Strawberry', date: '2025-07-10', result: 'Win' },
      { id: 'm2', opponent: 'Blueberry',   date: '2025-07-09', result: 'Loss' },
      { id: 'm3', opponent: 'Apple',       date: '2025-07-08', result: 'Win' },
      { id: 'm4', opponent: 'Banana',      date: '2025-07-07', result: 'Win' },
      { id: 'm5', opponent: 'Cherry',      date: '2025-07-06', result: 'Loss' },
    ])
  }, [])

  const displayAvatar = avatar ?? defaultAvatar

  const formatDate = (iso: string): string => {
    const [y, m, d] = iso.split('-')
    return `${y}.${m}.${d}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/mymenu')}
        className="font-body absolute top-4 right-6 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
      >
        × MENU
      </button>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 space-y-8">
        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src={displayAvatar}
              alt="Your avatar"
              className="w-44 h-44 rounded-3xl bg-gray-100 object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-heading tracking-wider font-bold text-gray-800">
              Hi {username}!
            </h1>
            <div className="font-body tracking-wider space-y-2">
              <p>
                <span className="font-medium">Email:</span> {email}
              </p>
              <p>
                <span className="font-medium">Wins:</span>{' '}
                <span className="text-green-600">{stats.wins}</span>
              </p>
              <p>
                <span className="font-medium">Losses:</span>{' '}
                <span className="text-red-500">{stats.losses}</span>
              </p>
              <p>
                <span className="font-medium">Total Matches:</span> {stats.matches}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/me/edit')}
              className="font-heading tracking-wider px-6 py-2 bg-gray-800 hover:bg-[#26B2C5] text-white rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4 px-2">
            Match History
          </h2>
          <div className="overflow-y-auto max-h-51.5 border rounded-lg">
            <table className="table-fixed w-full text-left font-body text-gray-700">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="w-1/3 p-2">Date</th>
                  <th className="w-1/3 p-2">Opponent</th>
                  <th className="w-1/3 p-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-t last:border-b-0">
                    <td className="w-1/3 p-2">{formatDate(m.date)}</td>
                    <td className="w-1/3 p-2">{m.opponent}</td>
                    <td
                      className={`w-1/3 p-2 font-semibold ${
                        m.result === 'Win'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {m.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
