import { Col, Container, Row } from "react-bootstrap";
import AddressView from "./AddressView";


function FooterView() {
    return (
        <>
        <footer className="fixed-footer">
            <Container>
                <Row>
                    <Col className="mt-4">
                        <h4>Visit us!</h4>
                        <AddressView />
                    </Col>
                    <Col className="mt-4">
                        <h4>Hours</h4>
                        <p>Monday through Saturday 10am - 3pm</p>
                    </Col>
                    <Col className="mt-4">
                        <h4>Connect with us!</h4>
                        <p>This is where I would put our socials... if I got to it.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
        </>
    );
}

export default FooterView;