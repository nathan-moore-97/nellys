import { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import DataTable from "../../common/DataTable";
import { useAuth, type AuthContextType } from "../../auth/AuthProvider";
import ProtectedComponent from "../../auth/ProtectedComponent";

interface NewsletterSignupEntry {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    greeting: string | null;
    isActive: boolean;
    cancellationReason: string | null;
}


const API_URL = import.meta.env.VITE_API_URL;


async function getAllSignups(): Promise<NewsletterSignupEntry[]> {
    const response = await fetch(`${API_URL}/newsletter`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
    });

    return await response.json() as NewsletterSignupEntry[];
}

function SignupListPage() {

    const [signups, setSignups] = useState<NewsletterSignupEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth() as AuthContextType;

    const fetchDataSource = async () => {
        if (isAuthenticated) {
            try {
                setSignups(await getAllSignups());
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred when retrieving signup data.");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchDataSource();
        }
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt5">
                <Spinner animation="border" role="status" />
                <span className="visuall-hidden">Loading...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">
                    Failed to load signups: {error}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <h2 className="mb-4">Newsletter Signups</h2>
            <Container className="mt-4">
                <ProtectedComponent>
                    <DataTable<NewsletterSignupEntry> data={signups} />
                </ProtectedComponent>
            </Container>
        </>
    );
}

export default SignupListPage;