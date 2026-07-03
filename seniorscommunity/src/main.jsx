import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL
  window.API_BASE_URL = API_BASE_URL
} else {
  window.API_BASE_URL = ''
}

createRoot(document.getElementById('root')).render(
    <App />
)
