import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLink } from "react-icons/fa";
import AddressView from "./contact/AddressView";
import HoursView from "./contact/HoursView";
import PhoneEmailView from "./contact/PhoneEmail";

function FooterView() {
    return (
        <footer className="bg-dark text-white py-4 fixed-footer">
            <Container>
                <Row className="g-4">
                    <Col xs={12} md={4}>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="me-2 fs-4" />
                                <h4 className="mb-0">Woodlawn & Pope-Leighey House</h4>
                            </div>
                        </div>
                        <AddressView />
                        <HoursView />
                    </Col>
                    
                    <Col xs={12} md={4}>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="d-flex align-items-center">
                                <FaEnvelope className="me-2 fs-4" />
                                <h4 className="mb-0">Contact</h4>
                            </div>
                        </div>
                        <div>
                            <PhoneEmailView />
                        </div>
                    </Col>
                    
                    <Col xs={12} md={4}>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="d-flex align-items-center">
                                <FaLink className="me-2 fs-4" />
                                <h4 className="mb-0">Connect With Us</h4>
                            </div>
                        </div>
                        <p className="mb-3">Follow us on social media for updates and events!</p>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <a href="https://www.facebook.com/nellysneedlers/" className="text-white"><FaFacebook size={24} /></a>
                                <a href="https://www.instagram.com/nellys.needlers/" className="text-white"><FaInstagram size={24} /></a>
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Row className="mt-4">
                    <Col xs={12}>
                        <div className="text-center pt-3 border-top">
                            <p className="mb-0 small">
                                &copy; {new Date().getFullYear()} Nelly's Needlers. All rights reserved. | 
                                <a href="#" className="text-white ms-1">Privacy Policy</a> | 
                                <a href="#" className="text-white ms-1">Terms of Service</a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default FooterView;