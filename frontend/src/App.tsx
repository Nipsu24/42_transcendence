import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import PongLoader from './components/PongLoader'
import LandingPage from './pages/LandingPage'
import MyHomePage from './pages/MyHomePage'
import GameMenuPage from './pages/GameMenuPage'
import GamePage from './pages/GamePage'
import AboutPage from './pages/AboutPage'
import HaveFunPage from './pages/HaveFunPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import MyMenuPage from './pages/MyMenuPage'
import MyPage from './pages/MyPage'
import MyEditPage from './pages/MyEditPage'
import FriendsPage from './pages/FriendsPage'
import SearchFriendsPage from './pages/SearchFriendsPage'
import RequireAuth from './components/RequireAuth'

export default function App() {
	const [loading, setLoading] = useState<boolean>(true)
	const navigate = useNavigate()
	useEffect(() => {
	// Show loader animation for 2.2 seconds on first render
	  const t = setTimeout(() => setLoading(false), 2200)
	  return () => clearTimeout(t)
	}, [])
  // Redirect to /login if unauthorized flag is set (401 handler from interceptor)
	useEffect(() => {
	  if (sessionStorage.getItem('unauthorized')) {
		sessionStorage.removeItem('unauthorized')
		navigate('/login')
	  }
	}, [navigate])
  
	if (loading) return <PongLoader />

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
	  <Route path="/gamemenu" element={<GameMenuPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/havefun" element={<HaveFunPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected route group (redirect to /login if no token) */}
      <Route element={<RequireAuth />}>
        <Route path="/mymenu" element={<MyMenuPage />} />
        <Route path="/myhome" element={<MyHomePage />} />
        <Route path="/me" element={<MyPage />} />
        <Route path="/me/edit" element={<MyEditPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/search" element={<SearchFriendsPage />} />
      </Route>

      {/*/section/* → /section */}
      <Route path="/myhome/*" element={<Navigate to="/myhome" replace />} />
      <Route path="/mymenu/*" element={<Navigate to="/mymenu" replace />} />
      <Route path="/gamemenu/*" element={<Navigate to="/gamemenu" replace />} />
      <Route path="/me/*" element={<Navigate to="/me" replace />} />
      <Route path="/game/*" element={<Navigate to="/game" replace />} />
      <Route path="/friends/*" element={<Navigate to="/friends" replace />} />
      <Route path="/search/*" element={<Navigate to="/search" replace />} />

      {/* Final catch-all */}
      <Route path="*" element={<Navigate to={localStorage.getItem('jwtToken') ? '/myhome' : '/'} replace />} />
    </Routes>
  )
}
