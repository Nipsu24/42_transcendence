import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import axios from 'axios';

const token = localStorage.getItem('jwtToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.interceptors.response.use(
	res => res,
	err => {
	  if (err.response?.status === 401) {
		window.location.href = '/login';
	  }
	  return Promise.reject(err);
	}
  );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

