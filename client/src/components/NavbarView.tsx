import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavbarView() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar expanded={expanded} bg="primary" variant="dark" expand="sm" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Nellys Needlers
                </Navbar.Brand>
                        
                <Navbar.Toggle onClick={() => {setExpanded(!expanded)}} aria-controls="basic-navbar" />

                <Navbar.Collapse id="basic-navbar" >
                    <Nav className="ms-auto">
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/calendar">Calendar</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/donate">Donate</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/gallery">Gallery</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/signups">Signups</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarView;