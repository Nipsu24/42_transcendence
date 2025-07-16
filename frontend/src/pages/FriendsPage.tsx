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
import { FriendCard } from '../components/FriendCard'

interface Friend {
  id: string
  name: string
  avatar: string
  online: boolean
}

export default function FriendsPage() {
  const navigate = useNavigate()

  // dummy
  const [friends, setFriends] = useState<Friend[]>([
    { id: 'f1', name: 'Strawberry', avatar: avatar4, online: true },
    { id: 'f2', name: 'Blueberry',  avatar: avatar2, online: true },
    { id: 'f3', name: 'Apple',      avatar: defaultAvatar, online: true },
    { id: 'f4', name: 'Banana',     avatar: avatar7, online: false },
    { id: 'f5', name: 'Watermelon', avatar: avatar3, online: false },
  ])

  const total    = friends.length
  const onlineCnt = friends.filter(f => f.online).length

  const handleRemove = (id: string) => {
	alert(`${id} Are you sure?`) 
    setFriends(current => current.filter(f => f.id !== id))
  }

//   const handleInvite = (name: string) => {
//     alert(`${name}!`) 
//   }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => navigate('/mymenu')}
          className="font-body absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
        >
          × MENU
        </button>
        <div className="flex flex-col items-center space-y-6 my-18">
          <img
            src={defaultAvatar}
            alt="Your avatar"
            className="w-32 h-32 rounded-3xl bg-gray-100 object-cover"
          />
          <h2 className="text-3xl font-heading font-bold text-gray-800">
            Hi Gugu!
          </h2>
          <p className="font-body text-gray-600">gugu@example.com</p>
          <button
            onClick={() => navigate('/search')}
            className="font-body tracking-wider mt-4 px-6 py-2 bg-gray-800 hover:bg-[#26B2C5] text-white font-medium rounded-lg transition"
          >
            Search Friend
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
                avatarUrl={f.avatar}
                online={f.online}
                onDelete={() => handleRemove(f.id)}
                // onInvite={() => handleInvite(f.name)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
