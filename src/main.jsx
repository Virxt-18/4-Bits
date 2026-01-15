import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n"
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";


createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
    </AuthProvider>
)
