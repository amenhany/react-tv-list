import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/index.css'

import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'


setTimeout(() => {
    document.body.classList.remove("preload");
    const staleStyle = document.getElementById('theme-fix-style');
  if (staleStyle) staleStyle.remove();
}, 500);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
