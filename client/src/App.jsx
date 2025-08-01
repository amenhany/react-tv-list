import './css/App.css'
import './css/Animations.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import useFavicon from './js/useFavicon';

import Home from "./pages/Home"
import Search from "./pages/Search"
import List from './pages/List';
import User from './pages/User';
import Navbar from './components/navbar/Navbar';
import Error from "./components/Error"
import Dimmer from './components/Dimmer';

import AuthProvider from './contexts/AuthContext';
import ThemeProvider from './contexts/ThemeContext';
import DimmerProvider from './contexts/DimmerContext';
import SwitchPageProvider from './contexts/SwitchPageContext';
import SearchTriggerProvider from './contexts/SearchTriggerContext';
import { Toaster } from 'react-hot-toast';


export default function App() {
  const location = useLocation();
  useFavicon();

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
          <Route path="/user/" element={<User />} />
          <Route path="/user/:username" element={<User />} />
          <Route path="*" element={<Error text={`"${location.pathname}" not found`} statusCode="404" />} />
      </Routes>
      <Dimmer />
      <Toaster 
      toastOptions={{
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)'
          }
        }} />

    </SearchTriggerProvider>
    </SwitchPageProvider>
    </AuthProvider>
    </DimmerProvider>
    </ThemeProvider>
  )
}