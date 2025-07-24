import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { Button, NavDropdown } from 'react-bootstrap';
import ProtectedComponent from './auth/ProtectedComponent';
import { FaCalendarAlt, FaImages, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { UserRole } from './auth/UserRole';

function NavbarView() {
    const [expanded, setExpanded] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setExpanded(false);
    }

    const closeMenu = () => setExpanded(false);

    return (
        <Navbar 
            expanded={expanded} 
            bg="primary" 
            variant="dark" 
            expand="lg" 
            className="shadow-sm"
        >
            <Container fluid="lg">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    Nelly's Needlers
                </Navbar.Brand>
                        
                <Navbar.Toggle 
                    onClick={() => setExpanded(!expanded)} 
                    aria-controls="main-navbar" 
                >
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-lg-center">
                        <Nav.Link onClick={closeMenu} as={Link} to="/calendar" className="d-flex align-items-center px-3">
                            <FaCalendarAlt className="me-2" />
                            Calendar
                        </Nav.Link>
                        
                        <Nav.Link onClick={closeMenu} as={Link} to="/gallery" className="d-flex align-items-center px-3">
                            <FaImages className="me-2" />
                            Gallery
                        </Nav.Link>
                        
                        <Nav.Link onClick={closeMenu} as={Link} to="/contact" className="d-flex align-items-center px-3">
                            <FaEnvelope className="me-2" />
                            Contact
                        </Nav.Link>

                        <ProtectedComponent requires={UserRole.BOARD}>
                            <NavDropdown 
                                title="Manage"
                                id="manage-dropdown"
                                align="end"
                                className="px-3"
                            >
                                <NavDropdown.Item onClick={closeMenu} as={Link} to="/signups">
                                    Newsletter Signups
                                </NavDropdown.Item>
                            </NavDropdown>
                        </ProtectedComponent>
                        <ProtectedComponent requires={UserRole.ADMIN}>
                            <NavDropdown 
                                title="Admin"
                                id="admin-dropdown"
                                align="end"
                                className="px-3"
                            >
                                <NavDropdown.Item onClick={closeMenu} as={Link} to="/users">
                                    Users
                                </NavDropdown.Item>
                            </NavDropdown>
                        </ProtectedComponent>
                        <ProtectedComponent>    
                            <Button 
                                variant="outline-light rounded" 
                                onClick={handleLogout} 
                                className="ms-lg-2 mt-2 mt-lg-0 d-flex align-items-center"
                            >
                                <FaSignOutAlt className="me-2" />
                                Logout
                            </Button>
                        </ProtectedComponent>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarView;