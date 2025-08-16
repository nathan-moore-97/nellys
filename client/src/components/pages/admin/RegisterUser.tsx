import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterUser() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        repeatPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [registered, setRegistered] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Check if passwords match when either password field changes
        if (name === 'password' || name === 'repeatPassword') {
            const newPassword = name === 'password' ? value : formData.password;
            const newRepeatPassword = name === 'repeatPassword' ? value : formData.repeatPassword;
            setPasswordsMatch(newPassword === newRepeatPassword);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        if (!passwordsMatch) {
            setLoading(false);
            return;
        }

        registerNewUser();
    };

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        setToken(tokenParam);
        if (tokenParam) {
            verifyToken(tokenParam);
        }
    }, [searchParams]);

    const verifyToken = async(tokenParam: string) => {
        const response = await fetch(`${API_URL}/register/verify`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            }, 
            body: JSON.stringify({token: tokenParam})
        });
        if (!response.ok) {
            setToken(null);
        }
    }

    const registerNewUser = async() => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({data: formData, token: token}),
        })

        if (response.ok) {
            setRegistered(true);
        }
    }

    if (!token) {
        return (
            <>
                <Alert variant="danger">Forbidden</Alert>
            </>
        );
    }

    if (registered) {
        return (
            <>
                <Alert variant="success">Account created successfully.</Alert>
                <Button onClick={() => navigate("/login")}>
                    <span>Back to login</span>
                    <FaSignInAlt className="px-3"/>
                </Button>
            </>
        );
    }

    return(
        <>
            <h2>Create Your Account</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        name="firstName" 
                        placeholder="John" 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        name="lastName" 
                        placeholder="Doe" 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        name="email" 
                        placeholder="jdoe@email.com" 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={formData.username} 
                        onChange={handleChange} 
                        name="username" 
                        placeholder="johndoe123" 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        name="password" 
                        placeholder="Create a password" 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRepeatPassword">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={formData.repeatPassword} 
                        onChange={handleChange} 
                        name="repeatPassword" 
                        placeholder="Repeat your password" 
                        required 
                    />
                    {!passwordsMatch && (
                        <Form.Text className="text-danger">
                            Passwords do not match
                        </Form.Text>
                    )}
                </Form.Group>

                <Button type="submit" disabled={loading || !passwordsMatch}>
                    {loading ? 'Creating account...' : 'Register'}
                </Button>
            </Form>
        </>
    )

}

export default RegisterUser;