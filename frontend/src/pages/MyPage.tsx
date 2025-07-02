import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 

import defaultAvatar from '../assets/Avatars/default.png'
import avatar1 from '../assets/Avatars/1.png'
import avatar2 from '../assets/Avatars/2.png'
import avatar3 from '../assets/Avatars/3.png'
import avatar4 from '../assets/Avatars/4.png'
import avatar5 from '../assets/Avatars/5.png'
import avatar6 from '../assets/Avatars/6.png'
import avatar7 from '../assets/Avatars/7.png'
import avatar8 from '../assets/Avatars/8.png'

const AVATAR_OPTIONS = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
]

interface Stats {
  wins: number
  losses: number
  matches: number
}

export default function MyPage() {
  const navigate = useNavigate() 
  // (In a real app, this would come from the logged-in user’s API data)
  const username = 'Gugu'
  const email = 'Gugu@example.com'

  // Initialize with the default avatar import
  const [avatar, setAvatar] = useState<string | null>(null)
  const [stats] = useState<Stats>({ wins: 12, losses: 8, matches: 20 })

  const displayAvatar = avatar ?? defaultAvatar

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
		<button
        onClick={() => navigate('/mymenu')}
        className="font-body absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
      >
        × MENU
      </button>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
	  <div className="flex items-center justify-center">
          <img
            src={displayAvatar}
            alt="Your avatar"
            className="ml-10 w-45 h-45 rounded-3xl bg-gray-100 object-cover"
          />
        </div>

        <div className="space-y-10 my-8 ml-10">
          <h1 className="text-5xl font-heading tracking-wider font-bold text-gray-800">
            Hi {username}!
          </h1>
          <div className="font-body tracking-wider space-y-2">
            <p><span className="font-medium">Email:</span> {email}</p>
            <p><span className="font-medium">Wins:</span> {stats.wins}</p>
            <p><span className="font-medium">Losses:</span> {stats.losses}</p>
            <p><span className="font-medium">Total Matches:</span> {stats.matches}</p>
          </div>
          <button
            type="button"
            className="font-heading tracking-wider my-5 mt-0.5 px-6 py-2 bg-gray-800 hover:bg-[#26B2C5] text-white rounded-lg transition"
			onClick={() => navigate('/me/edit')}
          >
            Edit Profile
          </button>
		</div>
        </div>
      </div>
  )
}
