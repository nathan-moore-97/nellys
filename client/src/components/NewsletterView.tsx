import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";

interface SignupRequest {
    firstName: string,
    lastName: string,
    email: string,
    greeting: string
}

interface SignupResponse {
    error: string | null,
}

const API_URL = import.meta.env.VITE_API_URL

async function subscribeToNewsletter(params: SignupRequest): Promise<SignupResponse> {

    const response = await fetch(`${API_URL}/newsletter`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    });

    return await response.json() as SignupResponse;
}



function NewsletterView() {

    const [formData, setFormData] = useState<SignupRequest>({
        firstName: '',
        lastName: '',
        email: '',
        greeting: '',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const resp = await subscribeToNewsletter(formData);

        if (resp!.error) {
            setErr(resp!.error)
        } else {
            setSubmitted(true);
        }

        setLoading(false);
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
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            greeting: '',
        })
    }

    /**
     * User feedback after the form has been submitted, failure state
     */
    if (err) {
        return (
            <>
                <Alert variant="danger">{err}</Alert>
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
            <Row>
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
            <Form.Group className="mb-3">
                <Form.Label>Greeting</Form.Label>
                <Form.Control as="textarea" rows={3} value={formData.greeting} onChange={handleChange}
                    name="greeting" placeholder="Tell us what brought you here!" />
            </Form.Group>
            <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Sign Up'}
            </Button>         
        </Form>
        </>
    );
    
}

export default NewsletterView;