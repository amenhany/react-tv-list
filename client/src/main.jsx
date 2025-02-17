import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../public/css/bootstrap.min.css'
import '../public/css/index.css'

import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
