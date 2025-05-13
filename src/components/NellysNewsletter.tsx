import { Button, Col, Form, Row } from "react-bootstrap";

function NellysNewsletter() {
    return (
        <>
        <h3>Join our Newsletter</h3>
        <Form>
            <Row className="mb-3">
                <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" name="firstName" placeholder="John" required/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" name="lastName" placeholder="Doe" required/>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="jdoe@email.com" required />
            </Form.Group>
            <Button type="submit">Sign Up</Button>        
        </Form>
        </>
    );
}

export default NellysNewsletter;