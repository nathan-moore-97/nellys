import type React from "react";
import { useAuth, type AuthContextType } from "./AuthProvider";

interface ProtectedComponentProps {
    children: React.ReactNode;
}

function ProtectedComponent(props: ProtectedComponentProps) {
    const { isAuthenticated } = useAuth() as AuthContextType;

    if (!isAuthenticated) {
        return null;
    }

    return (<>{props.children}</>);
}

export default ProtectedComponent;