import '../public/css/App.css'
import { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from './components/Navbar';
import List from './pages/List';


export const Theme = createContext({ isDarkMode: false, setIsDarkMode: () => {} });

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
  }, [isDarkMode])

  return (
    <Theme.Provider value={{ isDarkMode, setIsDarkMode }}>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/list" element={<List />} />
      </Routes>
    </Theme.Provider>
  )
}

export default App
