import './css/App.css'
import './css/Animations.css'
import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from './components/Navbar';
import List from './pages/List';
import Error from "./components/Error"


export const Theme = createContext({ isDarkMode: false, setIsDarkMode: () => {} });
export const SwitchPage = createContext({ isSwitchPage: false, setIsSwitchPage: () => {}});

function App() {
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      return (storedTheme === 'dark');
    }

    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  });

  const [isSwitchPage, setIsSwitchPage] = useState(false);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem('theme', theme);
    document.body.setAttribute("data-bs-theme", theme);
  }, [isDarkMode])

  return (
    <Theme.Provider value={{ isDarkMode, setIsDarkMode }}>
    <SwitchPage.Provider value={{ isSwitchPage, setIsSwitchPage }}>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/list" element={<List />} />
          <Route path="*" element={<Error text={`"${location.pathname}" not found`} statusCode="404" />} />
      </Routes>
    </SwitchPage.Provider>
    </Theme.Provider>
  )
}

export default App
