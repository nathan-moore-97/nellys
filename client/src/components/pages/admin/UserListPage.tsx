import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Container, Spinner, Modal, Button, Form } from "react-bootstrap";
import DataTable from "../../common/DataTable";
import { useAuth, type AuthContextType } from "../../auth/AuthProvider";
import ProtectedComponent from "../../auth/ProtectedComponent";
import { UserRole } from "../../auth/UserRole";

interface UserEntry {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    roleId: UserRole;
}

interface RoleUpdateForm {
    userId: number;
    username: string;
    newRole: UserRole;
    reason: string;
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

async function updateUserRole(formData: RoleUpdateForm): Promise<void> {
    await fetch(`${API_URL}/admin/users/role`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            userId: formData.userId,
            adminUsername: formData.username,
            roleId: formData.newRole,
            reason: formData.reason.trim() || "No reason provided"
        }),
    });
}

function UserListPage() {
    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, username } = useAuth() as AuthContextType;

    // Modal and Form state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<RoleUpdateForm>({
        userId: 0,
        username: username,
        newRole: UserRole.NONE,
        reason: ""
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchDataSource = async () => {
        if (isAuthenticated) {
            try {
                setUsers(await getAllUsers());
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred when retrieving user data.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditClick = (user: UserEntry) => {
        setFormData({
            userId: user.id,
            newRole: user.roleId,
            username: username,
            reason: ""
        });
        setShowModal(true);
        setUpdateError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            await updateUserRole(formData);
            setUsers(users.map(user => 
                user.id === formData.userId ? { ...user, roleId: formData.newRole } : user
            ));
            setShowModal(false);
        } catch (err) {
            if (err instanceof Error) {
                setUpdateError(err.message);
            } else {
                setUpdateError("Failed to update user role.");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "newRole" ? Number(value) : value
        }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchDataSource();
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <span className="visually-hidden">Loading...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">
                    Failed to load users: {error}
                </Alert>
            </Container>
        );
    }

    const selectedUser = users.find(user => user.id === formData.userId);

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
                        onEdit={handleEditClick}
                        editButtonText="Change Role"
                    />
                </ProtectedComponent>
            </Container>

            {/* Role Update Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Role</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {selectedUser && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>User</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={`${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.username})`} 
                                        disabled 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Role</Form.Label>
                                    <Form.Select
                                        name="newRole"
                                        value={formData.newRole}
                                        onChange={handleChange}
                                    >
                                        {Object.entries(UserRole)
                                            .filter(([key]) => isNaN(Number(key)))
                                            .map(([key, value]) => (
                                                <option key={value} value={value}>
                                                    {key}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Reason for Change</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="reason"
                                        rows={3}
                                        placeholder="Explain why you're changing this role (required)"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}
                        {updateError && (
                            <Alert variant="danger" className="mt-3">
                                {updateError}
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isUpdating || !formData.reason.trim()}
                        >
                            {isUpdating ? (
                                <>
                                    <Spinner as="span" size="sm" animation="border" role="status" />
                                    <span className="visually-hidden">Updating...</span>
                                </>
                            ) : 'Update Role'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default UserListPage;