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

interface RegisterUserForm {
    email: string;
    roleId: number;
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

async function updateUserRole(roleUpdateFormData: RoleUpdateForm): Promise<void> {
    await fetch(`${API_URL}/admin/users/role`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            userId: roleUpdateFormData.userId,
            adminUsername: roleUpdateFormData.username,
            roleId: roleUpdateFormData.newRole,
            reason: roleUpdateFormData.reason.trim() || "No reason provided"
        }),
    });
}

async function registerUser(roleUpdateFormData: RegisterUserForm): Promise<void> {
    await fetch(`${API_URL}/register/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            email: roleUpdateFormData.email,
            roleId: roleUpdateFormData.roleId
        }),
    });
}

function UserListPage() {
    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, username } = useAuth() as AuthContextType;

    // Modal and Form state
    const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false);
    const [roleUpdateFormData, setRoleUpdateFormData] = useState<RoleUpdateForm>({
        userId: 0,
        username: username,
        newRole: UserRole.NONE,
        reason: ""
    });

    const [showRegisterUserModal, setShowRegisterUserModal] = useState(false);
    const [registerUserFormData, setRegisterUserFormData] = useState<RegisterUserForm>({
        email: "",
        roleId: UserRole.NONE,
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
        setRoleUpdateFormData({
            userId: user.id,
            newRole: user.roleId,
            username: username,
            reason: ""
        });
        setShowRoleUpdateModal(true);
        setUpdateError(null);
    };

    const handleRegisterUserSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await registerUser(registerUserFormData);
        setShowRegisterUserModal(false);
    };

    const handleUpdateRoleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            await updateUserRole(roleUpdateFormData);
            setUsers(users.map(user => 
                user.id === roleUpdateFormData.userId ? { ...user, roleId: roleUpdateFormData.newRole } : user
            ));
            setShowRoleUpdateModal(false);
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

    const handleRegisterUserChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegisterUserFormData(prev => ({
            ...prev,
            [name]: name === "newRole" ? Number(value) : value
        }));
    }

    const handleRoleUpdateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoleUpdateFormData(prev => ({
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

    const selectedUser = users.find(user => user.id === roleUpdateFormData.userId);

    return (
        <>
            <Container>
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Users</h2>
                    <div>
                        <ProtectedComponent requires={UserRole.ADMIN}>
                            <button className="btn btn-primary" onClick={() => setShowRegisterUserModal(true)}>Register User</button>
                        </ProtectedComponent>
                    </div>
                </div>
            </Container>
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

            {/* New User Registration Modal */}
            <Modal show={showRegisterUserModal} onHide={() => setShowRegisterUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New User</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRegisterUserSubmit}>
                    <Modal.Body>
                        
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" value={registerUserFormData.email} onChange={handleRegisterUserChange} 
                                name="email" placeholder="jdoe@email.com" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Role</Form.Label>
                            <Form.Select
                                name="roleId"
                                value={registerUserFormData.roleId}
                                onChange={handleRegisterUserChange}
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
                        
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRegisterUserModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Role Update Modal */}
            <Modal show={showRoleUpdateModal} onHide={() => setShowRoleUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Role</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateRoleSubmit}>
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
                                        value={roleUpdateFormData.newRole}
                                        onChange={handleRoleUpdateChange}
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
                                        value={roleUpdateFormData.reason}
                                        onChange={handleRoleUpdateChange}
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
                        <Button variant="secondary" onClick={() => setShowRoleUpdateModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isUpdating || !roleUpdateFormData.reason.trim()}
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