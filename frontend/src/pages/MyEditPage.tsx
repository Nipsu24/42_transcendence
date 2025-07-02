import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { AvatarSelector } from '../components/AvatarSelector'

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
  avatar1, avatar2, avatar3, avatar4,
  avatar5, avatar6, avatar7, avatar8,
]

interface Stats {
  wins: number
  losses: number
  matches: number
}

export default function MyEditPage() {
  
  const navigate = useNavigate()

  // In a real app, these would come from the logged-in user’s API data
  const [name, setName]   = useState<string>('Gugu')
  const [email, setEmail] = useState<string>('gugu@example.com')
  const [avatar, setAvatar] = useState<string>(defaultAvatar)
  const [stats] = useState<Stats>({ wins: 12, losses: 8, matches: 20 })

   // When the user selects a new avatar, update state (and later persist to backend)
  const handleAvatarSelect = (url: string) => {
    setAvatar(url)
  }

  // Save all changes (name, email, avatar) back to the server
  const handleSave = () => {
    console.log({ name, email, avatar })
    navigate('/me')  // After saving, navigate back to the profile view
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
		{/* Cancel button to return without saving */}
		<button
		onClick={() => navigate('/me')}
		className="font-body absolute top-4 right-6 z-50 text-gray-800 font-medium text-sm sm:text-base hover:opacity-60 transition"
		>
		× CANCLE
		</button>
		{/* Left: avatar selector */}
		  <AvatarSelector
            selected={avatar}
            options={AVATAR_OPTIONS}
            onSelect={handleAvatarSelect}
          />
		{/* Right: profile editing form */}
        <div className="space-y-10 my-10 ml-10">
          <h1 className="text-4xl font-heading tracking-wider font-bold text-gray-800">
            Edit your profile!
          </h1>
          <div className="space-y-4 font-body tracking-wider text-gray-700">
            <div>
              <label className="block mb-1 font-medium">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <p><span className="font-medium">Wins:</span> {stats.wins}</p>
              <p><span className="font-medium">Losses:</span> {stats.losses}</p>
              <p><span className="font-medium">Total Matches:</span> {stats.matches}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="mr-2 font-heading tracking-wider font-medium px-4 py-2 bg-gray-400 hover:bg-[#0489C2] text-white rounded-lg transition"
              onClick={() => console.log('Upload Avatar clicked')}
            >
              Upload Avatar
            </button>
            <button
              type="button"
              className="font-heading tracking-wider font-medium px-6 py-2 bg-gray-500 hover:bg-[#26B2C5] text-white rounded-lg transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
