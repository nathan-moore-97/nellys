
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeView from './components/Home/HomeView'
import ContactView from './components/Contact/ContactView'
import DonateView from './components/Donate/DonateView'
import CalendarView from './components/Calendar/CalendarView'
import NavbarView from './components/Navbar/NavbarView'

function App() {
  return (
    <Router>
      <NavbarView />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/donate" element={<DonateView />} /> 
      </Routes>
    </Router>
  )
}

export default App
