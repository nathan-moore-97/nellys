import { Navigate } from "react-router-dom";
import { useAuth, type AuthContextType } from "./AuthProvider";
import type { UserRole } from "./UserRole";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requires?: UserRole;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
    
    const { isAuthenticated, userRole } = useAuth() as AuthContextType;

    let hasPermission = true;

    if (props.requires) {
        if (props.requires > userRole) {
            hasPermission = false;
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!hasPermission) {
        return <Navigate to="/" replace />
    }

    return props.children;
}