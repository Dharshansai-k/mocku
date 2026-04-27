import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";



createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId="176325556273-i331oi6ng79soiitqiubevfi57p5lmgm.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
)
