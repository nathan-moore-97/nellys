import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './styles/App.css'
import HomePage from './components/pages/HomePage'
import ContactPage from './components/pages/ContactPage'
import DonatePage from './components/pages/DonatePage'
import CalendarPage from './components/pages/CalendarPage'
import NavbarView from './components/NavbarView'
import { Container } from 'react-bootstrap'
import UnsubscribePage from './components/pages/UnsubscribePage'
import GalleryPage from './components/pages/GalleryPage'
import FooterView from './components/FooterView'

function FooterConditional() {
  const location = useLocation();

  if (location.pathname === '/gallery') {
    return null;
  }

  return <FooterView />
}

function App() {
  return (
    <Router>
      <NavbarView />
      <Container className='page-content'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/gallery" element={<GalleryPage/>} />
        </Routes>
      </Container>
      <FooterConditional />
    </Router>
  )
}

export default App;
