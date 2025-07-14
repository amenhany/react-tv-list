import './css/App.css'
import './css/Animations.css'
import { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import List from './pages/List';
import Navbar from './components/Navbar';
import Error from "./components/Error"
import Dimmer from './components/Dimmer';
import AuthProvider from './contexts/AuthContext';
import ThemeProvider from './contexts/ThemeContext';
import DimmerProvider from './contexts/DimmerContext';
import SwitchPageProvider from './contexts/SwitchPageContext';
import SearchTriggerProvider from './contexts/SearchTriggerContext';


export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
    <DimmerProvider>
    <AuthProvider>
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
      <Dimmer />

    </SearchTriggerProvider>
    </SwitchPageProvider>
    </AuthProvider>
    </DimmerProvider>
    </ThemeProvider>
  )
}