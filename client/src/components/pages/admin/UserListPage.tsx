import { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import DataTable from "../../common/DataTable";
import { useAuth, type AuthContextType } from "../../auth/AuthProvider";
import ProtectedComponent from "../../auth/ProtectedComponent";
import { UserRole } from "../../auth/UserRole";

interface UserEntry {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    roleId: UserRole,
}


const API_URL = import.meta.env.VITE_API_URL;


async function getAllUsers(): Promise<UserEntry[]> {
    const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
    });

    return await response.json() as UserEntry[];
}

function UserListPage() {

    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth() as AuthContextType;

    const fetchDataSource = async () => {
        if (isAuthenticated) {
            try {
                setUsers(await getAllUsers());
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
            <h2 className="mb-4">Users</h2>
            <Container className="mt-4">
                <ProtectedComponent requires={UserRole.ADMIN}>
                    <DataTable<UserEntry> 
                        data={users}
                        enumMap={{
                            roleId: UserRole
                        }} 
                    />
                </ProtectedComponent>
            </Container>
        </>
    );
}

export default UserListPage;