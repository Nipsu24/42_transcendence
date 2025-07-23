import React, { useState, useEffect} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PongLoader    from './components/PongLoader'
import LandingPage   from './pages/LandingPage'
import MyHomePage    from './pages/MyHomePage'
import GameMenuPage  from './pages/GameMenuPage'
import GamePage      from './pages/GamePage'
import AboutPage     from './pages/AboutPage'
import HaveFunPage   from './pages/HaveFunPage'
import LoginPage     from './pages/LoginPage'
import SignUpPage    from './pages/SignupPage'
import MyMenuPage    from './pages/MyMenuPage'
import MyPage        from './pages/MyPage'
import MyEditPage    from './pages/MyEditPage'
import FriendsPage   from './pages/FriendsPage'
import SearchFriendsPage   from './pages/SearchFriendsPage'

export default function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PongLoader />

  return (
    <Routes>
      <Route path="/"       element={<LandingPage />} />
      <Route path="/gamemenu"   element={<GameMenuPage />} />
      <Route path="/mymenu" element={<MyMenuPage />} />
	  <Route path="/myhome" element={<MyHomePage />} />
	  <Route path="/me"     element={<MyPage />} />
      <Route path="/me/edit" element={<MyEditPage />} /> 
      <Route path="/game"   element={<GamePage />} />
	  {/* <Route path="/game" element={<Navigate to="/game/index.html" replace />} /> */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      <Route path="/about"  element={<AboutPage />} />
      <Route path="/havefun"  element={<HaveFunPage />} />
      <Route path="/login"  element={<LoginPage />} />
	  <Route path="/signup" element={<SignUpPage />} />
      <Route path="/friends" element={<FriendsPage />} />
	  <Route path="/search" element={<SearchFriendsPage />} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}
