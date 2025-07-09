import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavbarView() {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Nellys Needlers
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar" />
          
          <Navbar.Collapse id="basic-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
              <Nav.Link as={Link} to="/donate">Donate</Nav.Link>
              <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default NavbarView;