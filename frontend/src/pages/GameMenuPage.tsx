import React from 'react'
import { useNavigate } from 'react-router-dom'

interface MenuItem {
  label: string
  route: string
  color: string
  textColor: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'ABOUT',
    route: '/about',
    color: 'bg-[#FFF460] hover:bg-[#FEF018]',
    textColor: 'text-gray-800',
  },
  {
    label: 'GAME',
    route: '/game',
    color: 'bg-[#FFAC40] hover:bg-[#FE8915]',
    textColor: 'text-white',
  },
  {
    label: 'HAVE FUN :)',
    route: '/havefun',
    color: 'bg-[#FF7561] hover:bg-[#FF4F1A]',
    textColor: 'text-white',
  },
]

export default function GameMenuPage() {
  const navigate = useNavigate()

  const handleClose = (): void => {
    const isLoggedInNow: boolean = Boolean(localStorage.getItem('jwtToken'))
    navigate(isLoggedInNow ? '/myhome' : '/')
  }

  const handleMenuClick = (route: string): void => {
    if (route === '/about') {
      navigate('/about')
    } else {
      const isLoggedInNow: boolean = Boolean(localStorage.getItem('jwtToken'))
      navigate(isLoggedInNow ? route : '/login')
    }
  }

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-6 z-50 text-gray-800 font-medium text-sm sm:text-base hover:opacity-60 transition"
      >
        × CLOSE
      </button>

      {MENU_ITEMS.map((item: MenuItem) => (
        <button
          key={item.label}
          onClick={() => handleMenuClick(item.route)}
          className={`
            flex-1 w-full ${item.color} ${item.textColor}
            text-[clamp(2rem,6vw,6rem)]
            font-heading font-semibold uppercase tracking-tight
            flex items-center justify-center
            transition-all duration-300 hover:tracking-widest focus:outline-none
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
