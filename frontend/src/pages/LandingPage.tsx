import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header           from '../components/Header'
import BackgroundBall   from '../components/BackgroundBall'
import DominoGrid       from '../components/DominoGrid'
import StartGameCallout from '../components/StartGame'
import ThePongTitle     from '../components/ThePongTitle'

export default function LandingPage() {
  const navigate = useNavigate()
  const isLoggedIn: boolean = Boolean(localStorage.getItem('authToken'))

  const handleStart = (): void => {
    isLoggedIn ? navigate('/game') : navigate('/login')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fffffe]">
      <BackgroundBall />
      <Header />
      <ThePongTitle />
      <DominoGrid />
      <StartGameCallout onClick={handleStart} />
    </div>
  )
}
