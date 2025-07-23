import type React from "react";
import { useAuth, type AuthContextType } from "./AuthProvider";
import type { UserRole } from "./UserRole";

interface ProtectedComponentProps {
    children: React.ReactNode;
    requires?: UserRole;
}

function ProtectedComponent(props: ProtectedComponentProps) {
    const { isAuthenticated, userRole } = useAuth() as AuthContextType;

    let hasPermission = true;

    if (props.requires) {
        if (props.requires > userRole) {
            hasPermission = false;
        }
    }

    if (!isAuthenticated || !hasPermission) {
        return null;
    }

    return (<>{props.children}</>);
}

export default ProtectedComponent;