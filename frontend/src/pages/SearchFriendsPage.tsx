// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import defaultAvatar from '../assets/Avatars/default.png'

// interface Friend {
//   id: string
//   name: string
//   online: boolean
// }

// export default function FriendsPage() {
//   const navigate = useNavigate()

//   // Dummy logged-in user
// //   const username = 'Gugu'
// //   const email = 'gugu@example.com'


 

//   const total     = friends.length
//   const onlineCnt = friends.filter(f => f.online).length

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
//       <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
// 	  <button
//         onClick={() => navigate('/mymenu')}
//         className="font-body absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
//       >
//         × MENU
//       </button>
// 		<div className="flex items-center justify-center">
// 			<img
// 				src={defaultAvatar}
// 				alt="some friend"
// 				className="ml-10 w-45 h-45 rounded-3xl bg-gray-100 object-cover"
// 			/>
// 			</div>
// 			<div>
//               <label className="block mb-1 font-medium">Email</label>
//               <input
//                 type="search"
//                 value={FriendsPage.name}
//                 onChange={e => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//               />
//             </div>
//         {/* Left: own profile summary */}
//         <div className="flex flex-col items-center space-y-6 my-18">
//           <img
//             src={defaultAvatar}
//             alt="Your avatar"
//             className="w-32 h-32 rounded-3xl bg-gray-100 object-cover"
//           />
//           <h2 className="text-3xl font-heading font-bold text-gray-800">
//             Hi {username}!
//           </h2>
//           <p className="font-body text-gray-600">{email}</p>
//           <button
//             onClick={() => navigate('/search')}
//             className="font-body tracking-wider mt-4 px-6 py-2 bg-gray-800 hover:bg-[#26B2C5] text-white font-medium rounded-lg transition"
//           >
//             Search Friend
//           </button>
//         </div>

//         {/* Right: friends list with count */}
//         <div className="space-y-4">
//           <h3 className="flex items-baseline text-2xl font-heading font-semibold text-gray-800">
//             <span>Friends</span>
//             <span className="ml-2 text-sm font-body text-gray-600">
//               ({onlineCnt} / {total})
//             </span>
//           </h3>
//           <div className="space-y-2">
//             {friends.map(f => (
//               <FriendCard
//                 key={f.id}
//                 name={f.name}
//                 avatarUrl={f.avatar}
//                 online={f.online}
//               />
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }





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
