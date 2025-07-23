import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import defaultAvatar from '../assets/default.png'
import { getMe, Match } from '../services/players'

interface HistoryMatch {
	id: number
	opponent: string
	date: string
	result: 'Win' | 'Loss'
	points: string
}

interface Stats {
  wins: number
  losses: number
  matches: number
}

export default function MyPage() {
  const navigate = useNavigate()

  // Profile state
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [avatar, setAvatarUrl] = useState<string>(defaultAvatar)
  const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0, matches: 0 })

  // Error & loading
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Match history (stubbed until backend supports real endpoint)
  const [matches, setMatches] = useState<HistoryMatch[]>([])
  const location = useLocation() as { state: { refresh?: boolean } }
  const refresh = location.state?.refresh ?? false

  useEffect(() => {
    const loadProfile = async () => {
      try {
		const me = await getMe()
		const myName = me.name
  
		setName(me.name)
		setEmail(me.e_mail)
		setAvatarUrl(me.avatar ?? defaultAvatar)
  
		// Use stored stats directly
		const wins = me.stats?.victories ?? 0
		const losses = me.stats?.defeats ?? 0
		setStats({ wins, losses, matches: wins + losses })
  
		const matches: Match[] = me.stats?.matches ?? []
  
		const history: HistoryMatch[] = matches.map((m: Match) => {
			const isPlayerOne = m.playerOneName === myName
			const myScore = isPlayerOne ? m.resultPlayerOne : m.resultPlayerTwo
			const opponentScore = isPlayerOne ? m.resultPlayerTwo : m.resultPlayerOne
			const opponent = isPlayerOne ? m.playerTwoName : m.playerOneName
			const result: 'Win' | 'Loss' = myScore > opponentScore ? 'Win' : 'Loss'
		  
			return {
			  id: m.id,
			  opponent: opponent ?? 'AI',
			  date: m.date,
			  result,
			  points: `${myScore} - ${opponentScore}`,
			}
		})		  
  
		setMatches(history)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [refresh]);

  const formatDate = (iso: string): string => {
	const date = new Date(iso)
	return date.toLocaleDateString('en-US', {
	  year: 'numeric',
	  month: 'short',
	  day: 'numeric'
	})
  }  

  if (loading) return <div className="p-8 text-center">Loading profile…</div>
  if (error)   return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/mymenu')}
        className="font-body absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
      >
        × MENU
      </button>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 space-y-8">
        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
            //   src={avatar}
            //   alt="Your avatar"
			  src={avatar}
			  alt="Your avatar"
			  onError={(e) => {
				const target = e.currentTarget
				if (target.src !== defaultAvatar) {
				  target.src = defaultAvatar
				}
			  }}
              className="w-44 h-44 rounded-3xl bg-gray-100 object-contain"
            />
          </div>
          <div className="space-y-6">
		  <h1 className="text-5xl font-heading tracking-wider font-bold text-gray-800">
              Hi {name}!
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
                <span className="font-medium">Total Matches:</span>{' '}
                {stats.matches}
              </p>
            </div>
            <button
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
          <div className="overflow-y-auto max-h-[240px] border rounded-lg">
		  	<table className="table-fixed w-full text-left font-body text-gray-700">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
				  <th className="w-1/3 p-2">Date</th>
                  <th className="w-1/3 p-2">Opponent</th>
                  <th className="w-1/3 p-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
					<tr key={m.id} className="border-t last:border-b-0">
					<td className="w-1/3 p-2 font-body font-normal">{formatDate(m.date)}</td>
					<td className="w-1/3 p-2 font-body font-normal">{m.opponent}</td>
					<td className="w-1/3 p-2 font-body font-normal">
						<span className={m.result === 'Win' ? 'text-green-600' : 'text-red-500'}>
						{m.result}</span>{' '}
						<span className="text-gray-800">({m.points})</span>
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
