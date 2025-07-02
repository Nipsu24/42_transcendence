import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="site-header relative">
      <div className="inner">
        <div className="flex-1" />
      </div>

      <nav className="font-body tracking-wider absolute bottom-[0.6rem] right-[2vw] flex gap-6 sm:gap-8 font-medium text-sm sm:text-base z-30">
        <button
          onClick={() => navigate('/gamemenu')}
          className="hover:underline transition relative top-[3px]"
        >
          Game
        </button>
        <button
          onClick={() => navigate('/login')}
          className="login-btn"
        >
          Login
        </button>
      </nav>

      <div className="absolute bottom-0 left-[2vw] right-[2vw] border-b border-[var(--border-color)] h-px" />
    </header>
  )
}
