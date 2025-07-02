import React from 'react'

interface FriendCardProps {
  name: string
  avatarUrl: string
  online: boolean
}

export const FriendCard: React.FC<FriendCardProps> = ({
  name, avatarUrl, online
}) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm">
    <img
      src={avatarUrl}
      alt={`${name}'s avatar`}
      className="w-12 h-12 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="font-body font-medium text-gray-800">{name}</p>
    </div>
    <span
      className={`w-3 h-3 rounded-full ${
        online ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={online ? 'Online' : 'Offline'}
    />
  </div>
)
