import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";

import { subscribeToNewsletter } from "./NewsletterController";
import type { NewsletterSignup } from "./NewsletterModel";

function NewsletterView() {

    const [formData, setFormData] = useState<NewsletterSignup>({
        firstName: '',
        lastName: '',
        email: ''
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [err, setErr] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const subscriptionStatus = await subscribeToNewsletter(formData);
            setSubmitted(subscriptionStatus);
        } catch (err) {
            console.error(err);
            setErr(true);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    /**
     * User would like to submit again, reset control values
     */
    const handleNewResponse = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(false);
        setSubmitted(false);
    }

    /**
     * User feedback after the form has been submitted, failure state
     */
    if (err) {
        return (
            <>
                <Alert variant="danger">
                    Something went wrong, try again later.
                </Alert>
            </>
        );
    }

    /**
     * User feedback after the form has been submitted
     */
    if (submitted) {
        return (
            <>
                <Alert variant="success">
                    Thank you for subscribing to our newsletter!
                </Alert>
                <Form onSubmit={handleNewResponse}>
                    <button type="submit">Click here to submit another response</button>
                </Form>
            </>
        );
    }

    return (
        <>
        <h3>Join our Newsletter</h3>
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={formData.firstName} onChange={handleChange} 
                            name="firstName" placeholder="John" required/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={formData.lastName} onChange={handleChange} 
                            name="lastName" placeholder="Doe" required/>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" value={formData.email} onChange={handleChange} 
                    name="email" placeholder="jdoe@email.com" required />
            </Form.Group>
            <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Sign Up'}
            </Button>         
        </Form>
        </>
    );
}

export default NewsletterView;