import './css/App.css'
import './css/Animations.css'
import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from './components/Navbar';
import List from './pages/List';
import Error from "./components/Error"
import ThemeProvider from './contexts/ThemeContext';
import SwitchPageProvider from './contexts/SwitchPageContext';
import SearchTriggerProvider from './contexts/SearchTriggerContext';


function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
    <SwitchPageProvider>
    <SearchTriggerProvider>

      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/list" element={<List />} />
          <Route path="*" element={<Error text={`"${location.pathname}" not found`} statusCode="404" />} />
      </Routes>
      
    </SearchTriggerProvider>
    </SwitchPageProvider>
    </ThemeProvider>
  )
}

export default App
