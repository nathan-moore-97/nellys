import { useState, type MouseEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useAuth, type AuthContextType } from '../auth/AuthProvider';
import { NavDropdown } from 'react-bootstrap';

interface AuthenticatedNavProps {
    path: string
    onClick?: (event: MouseEvent<HTMLImageElement>) => void;
    children?: React.ReactNode;
} 

interface AuthenticatedDropdownProps {
    children?: React.ReactNode;
    title: string;
    
}

function AuthenticatedDropdown (props: AuthenticatedDropdownProps) {
    const { isAuthenticated } = useAuth() as AuthContextType;
    if (!isAuthenticated) {
        return null;
    }

    return <NavDropdown menuVariant='dark' title={props.title}>{props.children}</NavDropdown>
}


function AuthenticatedNav (props: AuthenticatedNavProps)  {
    const { isAuthenticated } = useAuth() as AuthContextType;

    if (!isAuthenticated) {
        return null;
    }

    return <Nav.Link onClick={() => {props.onClick}} as={Link} to={props.path}>{props.children}</Nav.Link>
}

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
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/gallery">Gallery</Nav.Link>
                        <Nav.Link onClick={() => {setExpanded(false)}} as={Link} to="/contact">Contact</Nav.Link>
                        <AuthenticatedDropdown title='Admin'>
                            <AuthenticatedNav onClick={() => {setExpanded(false)}} path='/signups'>Signups</AuthenticatedNav>
                        </AuthenticatedDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarView;