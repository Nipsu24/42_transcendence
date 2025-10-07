import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Initialize JWT token
const token = localStorage.getItem('jwtToken')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Handle SPA-safe 401 redirection with Axios interceptor
axios.interceptors.response.use(
  res => res,
  err => {
    const isLoginRequest = err.config?.url?.includes('/api/login')
    const isAlreadyOnLogin = window.location.pathname === '/login'

    if (err.response?.status === 401 && !isLoginRequest && !isAlreadyOnLogin) {
      sessionStorage.setItem('unauthorized', '1')
    }
    return Promise.reject(err)
  }
)

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);