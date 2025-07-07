import './css/App.css'
import './css/Animations.css'
import { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from './components/Navbar';
import List from './pages/List';


export const Theme = createContext({ isDarkMode: false, setIsDarkMode: () => {} });
export const SwitchPage = createContext({ isSwitchPage: false, setIsSwitchPage: () => {}});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const [isSwitchPage, setIsSwitchPage] = useState(false);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
  }, [isDarkMode])

  return (
    <Theme.Provider value={{ isDarkMode, setIsDarkMode }}>
    <SwitchPage.Provider value={{ isSwitchPage, setIsSwitchPage }}>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/list" element={<List />} />
      </Routes>
    </SwitchPage.Provider>
    </Theme.Provider>
  )
}

export default App
