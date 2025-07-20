import { useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Row, Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth, type AuthContextType } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface LoginRequest {
    username: string;
    password: string;
}

function LoginPage() {

    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const { login } = useAuth() as AuthContextType;
    const navigate = useNavigate();
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);

        try {
            if(await login(formData.username, formData.password)) {
                navigate("/");
            } else {
                setErr("Login failed");
            }
        } catch(err) {
            console.error(err);
            setErr("Unknown Error");
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (err) {
        return (
            <Container>
                <Alert variant="danger">
                    Sign-in failed: {err}
                </Alert>
            </Container>
        );
    }
    
    return (
        <>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={formData.username} onChange={handleChange} 
                            name="username" required/>
                    </Form.Group>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={formData.password} onChange={handleChange} 
                            name="password" required/>
                    </Form.Group>
                </Col>
                <Col></Col>
            </Row>
            <Button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Login'}
            </Button>      
        </Form>
        </>
    );
}

export default LoginPage;
