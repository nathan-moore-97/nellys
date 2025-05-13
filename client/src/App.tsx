
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import Donate from './components/pages/Donate'
import Calendar from './components/pages/Calendar'
import NellysNavbar from './components/NellysNavbar'

function App() {
  return (
    <Router>
      <NellysNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </Router>
  )
}

export default App
