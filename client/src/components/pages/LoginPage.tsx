import { useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Row, Form, Button, Container, Alert, Card, InputGroup } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
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
    
    return (
        <Container className="mt-4">
            <Row className="w-100">
                <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2 className="mb-0">Welcome Back</h2>
                                <p className="text-muted">Please sign in to your account</p>
                            </div>
                            
                            {err && (
                                <Alert variant="danger" className="mb-3">
                                    <Alert.Heading className="h6 mb-1">Sign-in failed</Alert.Heading>
                                    {err}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.username} 
                                        onChange={handleChange} 
                                        name="username" 
                                        placeholder="Enter your username"
                                        required
                                        disabled={loading}
                                        autoComplete="username"
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            name="password" 
                                            placeholder="Enter your password"
                                            required
                                            disabled={loading}
                                            autoComplete="current-password"
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            {showPassword ? <FaEyeSlash/> : <FaEye/> }
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                
                                <div className="d-grid">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;