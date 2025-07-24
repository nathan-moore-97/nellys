import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './styles/App.css'
import HomePage from './components/pages/HomePage'
import ContactPage from './components/pages/ContactPage'
import CalendarPage from './components/pages/CalendarPage'
import NavbarView from './components/NavbarView'
import { Container, Spinner } from 'react-bootstrap'
import FooterView from './components/FooterView'
import SignupListPage from './components/pages/manage/SignupListPage'
import LoginPage from './components/pages/LoginPage'
import GalleryPage from './components/pages/GalleryPage'
import UnsubscribePage from './components/pages/UnsubscribePage'
import { AuthProvider, useAuth } from './components/auth/AuthProvider'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { UserRole } from './components/auth/UserRole'
import UserListPage from './components/pages/admin/UserListPage'

function FooterConditional() {
    const location = useLocation();

    if (location.pathname === '/gallery') {
        return null;
    }

    return <FooterView />
}

function AppContent() {

    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <Container className="text-center mt5">
                <Spinner animation="border" role="status" />
                <span className="visuall-hidden">Loading...</span>
            </Container>
        );
    }

    return (
        <div className='app-container'>
            <Router>
                <NavbarView />
                <Container className='page-content'>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/unsubscribe" element={<UnsubscribePage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        
                        <Route path="/manage/signups" element={
                            <ProtectedRoute>
                                <SignupListPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/users" element={
                            <ProtectedRoute requires={UserRole.ADMIN}>
                                <UserListPage />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </Container>
                <FooterConditional />
            </Router>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App;
