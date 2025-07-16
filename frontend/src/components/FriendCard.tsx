import React from 'react'

interface FriendCardProps {
  name: string
  avatarUrl: string
  online: boolean
  onDelete: () => void
  onInvite?: () => void
}

export const FriendCard: React.FC<FriendCardProps> = ({
  name,
  avatarUrl,
  online,
  onDelete,
  onInvite,
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
    <div className="flex items-center space-x-4">
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <p className="font-body font-medium text-gray-800">{name}</p>
    </div>
    <div className="flex items-center space-x-2">
      <span
        className={`w-3 h-3 rounded-full ${
          online ? 'bg-green-500' : 'bg-gray-400'
        }`}
        title={online ? 'Online' : 'Offline'}
      />
      {/* {onInvite && (
        <button
          onClick={onInvite}
          className="px-2 py-1 text-xs font-body border border-gray-800 text-gray-500 rounded hover:bg-gray-500 hover:text-white transition"
        >
          Invite
        </button> 
      )} */}
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs font-body border border-gray-800 text-gray-600 rounded hover:bg-gray-700 hover:text-white transition"
      >
        Remove
      </button>
    </div>
  </div>
)
