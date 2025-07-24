import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header           from '../components/Header'
import BackgroundBall   from '../components/BackgroundBall'
import DominoGrid       from '../components/DominoGrid'
import StartGameCallout from '../components/StartGame'
import ThePongTitle     from '../components/ThePongTitle'

export default function LandingPage() {
  const navigate = useNavigate()
  const isLoggedIn: boolean = Boolean(localStorage.getItem('jwtToken'))

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fffffe]">
      <BackgroundBall />
    <header className="site-header relative">
      <div className="inner">
        <div className="flex-1" />
      </div>
      <nav className="font-body tracking-wide absolute bottom-[0.6rem] right-[2vw] flex gap-6 sm:gap-8 font-medium z-30">
        <button
          onClick={() => navigate('/gamemenu')}
          className="
		  hover:underline transition 
		  relative top-[3px]
		  text-sm sm:text-base 2xl:text-[1.6rem]
		  2xl:px-8 lg:py-1.2
		  "
        >
          Game
        </button>
        <button
          onClick={() => navigate('/mymenu')}
          className="
		  mymenu-btn
		  text-sm sm:text-base 2xl:text-[1.6rem]
		  2xl:px-7 lg:py-1.2
		  "
        >
          My menu
        </button>
      </nav>

      <div className="absolute bottom-0 left-[2vw] right-[2vw] border-b border-[var(--border-color)] h-px" />
    </header>

      <ThePongTitle />
      <DominoGrid />
      <StartGameCallout onClick={() => navigate('/game')} />
    </div>
  )
}
