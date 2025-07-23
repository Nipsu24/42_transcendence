import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../assets/default.png'
import { FriendCard } from '../components/FriendCard'

import {
  getMe,
  removeFriend,
  // optionally add addFriend here
} from '../services/players'

interface Friend {
  id: number
  name: string
  avatar: string
  online: boolean
}

interface MeResponse {
	id: number
	name: string
	e_mail: string
	avatar: string
	friends: Friend[]
  }

export default function FriendsPage() {
  const navigate = useNavigate()

  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [serverError, setServerError] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | undefined>(undefined)

  // load friends on mount

useEffect(() => {
	const fetchMe = async () => {
	  try {
		const me:MeResponse = await getMe()
		setAvatar(me.avatar ?? defaultAvatar)
		setFriends(me.friends ?? [])
	  } catch (err) {
		console.error(err)
		setServerError((err as Error).message)
	  }setLoading(false)
	}
	fetchMe()
  }, [])

  const total = friends.length
  const onlineCnt = friends.filter(f => f.online).length

  const handleRemove = async (name: string) => {
    if (!window.confirm('Remove this friend?')) return
    setServerError(null)
    try {
      await removeFriend(name)
      setFriends(current => current.filter(f => f.name !== name))
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      {serverError && (
        <div className="mb-4 text-red-500 text-center">{serverError}</div>
      )}
	    <button
          onClick={() => navigate('/mymenu')}
          className="absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
        >
          × MENU
        </button>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-5 grid grid-cols-1 md:grid-cols-2 gap-8 relative">

        <div className="flex flex-col items-center space-y-6 my-18">
          <img
			src={avatar}
			alt="Your avatar"
			onError={(e) => {
			  const target = e.currentTarget
			  if (target.src !== defaultAvatar) {
				target.src = defaultAvatar
			  }
			}}
            className="w-32 h-32 rounded-3xl bg-gray-100 object-cover"
          />
          <h2 className="text-3xl font-heading font-medium tracking-wider text-gray-700">
		  Good to see your crew!
          </h2>
          <button
            onClick={() => navigate('/search')}
            disabled={loading}
            className="font-body tracking-wider mt-4 px-6 py-2 bg-gray-800 hover:bg-[#26B2C5] text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Search Friend'}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="flex items-baseline text-2xl font-heading font-semibold text-gray-800">
            <span>Friends</span>
            <span className="ml-2 text-sm font-body text-gray-600">
              ({onlineCnt} / {total})
            </span>
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[60vh]">
            {friends.map(f => (
				
              <FriendCard
                key={f.id}
                name={f.name}
                avatar={f.avatar ?? defaultAvatar}
                online={f.online}
                onDelete={() => handleRemove(f.name)}
              />
            ))}
            {!loading && friends.length === 0 && (
              <p className="text-center text-gray-500">No friends yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
