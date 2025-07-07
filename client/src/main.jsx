import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './css/bootstrap.min.css'
import './css/index.css'

import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'


setTimeout(() => {
    document.body.classList.remove("preload");
}, 500);

if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.setAttribute("data-bs-theme", "dark");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
