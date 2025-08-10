import './css/App.css'
import './css/Animations.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import useFavicon from './js/useFavicon';

import Home from "./pages/Home"
import Search from "./pages/Search"
import List from './pages/List';
import User from './pages/User';
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer';
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

      {location.pathname !== '/' && 
        <div className="blob-container">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
          <div className="blob blob4"></div>
        </div>
      }
      <Navbar />
      <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/search" element={<Search />} />
            <Route path="/list" element={<List />} />
            <Route path="/user/" element={<User />} />
            <Route path="/user/:username" element={<User />} />
            <Route path="*" element={<Error text={`"${location.pathname}" not found`} statusCode="404" />} />
        </Routes>
      </main>
      <Footer />
      <Dimmer />
      <Toaster 
      toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            color: 'var(--toast-color)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }
        }} />

    </SearchTriggerProvider>
    </SwitchPageProvider>
    </AuthProvider>
    </DimmerProvider>
    </ThemeProvider>
  )
}