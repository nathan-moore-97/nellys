import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";

interface UnsubscribeRequest {
    email: string;
    reason: string;
}

interface UnsubscribeResponse {
    error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL

async function unsubscribeToNewsletter(params: UnsubscribeRequest): Promise<UnsubscribeResponse> {
    const response = await fetch(`${API_URL}/newsletter`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    });

    return await response.json() as UnsubscribeResponse;
}

function UnsubscribeView() {

    const [formData, setFormData] = useState<UnsubscribeRequest>({
        email: '',
        reason: '',
    });
    const [unsubscribed, setUnsubscribed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const resp = await unsubscribeToNewsletter(formData);

        if (resp!.error) {
            setErr(resp!.error)
        } else {
            setUnsubscribed(true);
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
     * User feedback after the form has been submitted, failure state
     */
    if (err) {
        return (
            <>
                <Alert variant="danger">{err}</Alert>
            </>
        );
    }

    if (unsubscribed) {
        return (
            <>
                <Alert variant="success">
                    You have successfully unsubscribed from the newsletter.
                </Alert>
            </>
        )
    }

    return(
        <>
            <h3>Unsubscribe from the Newsletter</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" value={formData.email} onChange={handleChange} 
                        name="email" placeholder="jdoe@email.com" required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control as="textarea" rows={3} value={formData.reason} onChange={handleChange}
                        name="reason" placeholder="Tell us why you're leaving" />
                </Form.Group>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
        </>
    );
}

export default UnsubscribeView;