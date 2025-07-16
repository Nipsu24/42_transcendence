import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

interface MenuItem {
  label: string
  route: string
  color: string
  textColor: string
}

const MY_ITEMS: MenuItem[] = [
  {
    label: 'ME',
    route: '/me',
    color: 'bg-[#AEE7EE] hover:bg-[#55CFD4]',
    textColor: 'text-gray-800',
  },
  {
    label: 'FRIENDS',
    route: '/friends',
    color: 'bg-[#82C5CB] hover:bg-[#26B2C5]',
    textColor: 'text-white',
  },
  {
    label: 'LOG OUT',
    route: '/',
    color: 'bg-[#3FA0C1] hover:bg-[#0489C2]',
    textColor: 'text-white',
  },
]

export default function MyMenuPage() {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    logout()      // 1) removes authToken
    navigate('/') // 2) sends user to home/login
  }

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <button
        onClick={() => navigate('/myhome')}
        className="absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
      >
        × HOME
      </button>

      {/* MY / FRIENDS / LOG OUT */}
      {MY_ITEMS.map((item: MenuItem) => {
        const onClick = item.label === 'LOG OUT'
          ? handleLogout
          : () => navigate(item.route)

        return (
          <button
            key={item.label}
            onClick={onClick}
            className={`
              flex-1 w-full
              ${item.color} ${item.textColor}
              text-[clamp(2rem,6vw,6rem)]
              font-heading font-semibold uppercase tracking-tight
              flex items-center justify-center
              transition-all duration-300 hover:tracking-widest focus:outline-none
            `}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
