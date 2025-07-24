import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Button 
                variant="outline-light rounded" 
                onClick={handleShowModal} 
                className="ms-lg-2 mt-2 mt-lg-0 d-flex align-items-center"
            >
                <FaSignOutAlt className="me-2" />
                Logout
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}