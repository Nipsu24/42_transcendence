import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

const MENU_ITEMS = [
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
	  label: 'MATCH',
	  route: '/match',
	  color: 'bg-[#FF7561] hover:bg-[#FF4F1A]',
	  textColor: 'text-white',
	},
  ]

export default function GameMenuPage() {
	const navigate = useNavigate()
  
	const handleClose = () => {
		const isLoggedInNow = Boolean(localStorage.getItem('authToken'))
		navigate(isLoggedInNow ? '/myhome' : '/')
	}
	const handleMenuClick = (route: string) => {
		if (route === '/about') {
		  navigate('/about')
		} else {
		  // 메뉴 클릭할 때도 매번 상태 재확인
		  const isLoggedInNow = Boolean(localStorage.getItem('authToken'))
		  navigate(isLoggedInNow ? route : '/login')
		}
	  }
		
	return (
	  <div className="relative flex flex-col h-screen overflow-hidden">
		{/* Close  */}
		<button
		  onClick={handleClose}
		  className="absolute top-4 right-6 z-50 text-gray-800 font-medium text-sm sm:text-base hover:opacity-60 transition"
		>
		  × CLOSE
		</button>
  
		{MENU_ITEMS.map(({ label, route, color, textColor }) => (
		  <button
			key={label}
			onClick={() => handleMenuClick(route)}
			className={`
			  flex-1 w-full ${color} ${textColor}
			  text-[clamp(2rem,6vw,6rem)]
			  font-heading font-semibold uppercase tracking-tight
			  flex items-center justify-center
			  transition-all duration-300 hover:tracking-widest focus:outline-none
			`}
		  >
			{label}
		  </button>
		))}
	  </div>
	)
  }