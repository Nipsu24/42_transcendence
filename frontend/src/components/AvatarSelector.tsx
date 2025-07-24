import React from 'react'
import defaultAvatar from '../assets/default.png'

export interface AvatarSelectorProps {
  selected: string
  options: string[]
  onSelect: (url: string) => void
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selected,
  options,
  onSelect,
}) => (
  <div className="mx-auto md:ml-10 mb-9 space-y-8">
    <div className="flex justify-center">
      <img
        src={selected}
        alt="current avatar"
		onError={(e) => {
		  const target = e.currentTarget
		  if (target.src !== defaultAvatar) {
			target.src = defaultAvatar
		  }
		}}
        className="w-32 h-32 rounded-3xl my-18 mb-10 bg-gray-100 object-cover"
      />
    </div>
    <div className="grid grid-cols-4 gap-3">
      {options.map((url) => (
        <button
          key={url}
          type="button"
          onClick={() => onSelect(url)}
          className={`my-2 w-16 h-16 rounded-3xl overflow-hidden border px-2 ${
            selected === url ? 'border-gray-200'  : 'border-transparent'
          } focus:outline-none`}
        >
          <img src={url} alt="avatar option" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  </div>
)
