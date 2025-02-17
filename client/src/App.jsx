import '../public/css/App.css'
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from './components/Navbar';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
      </Routes>
    </>
  )
}

export default App
