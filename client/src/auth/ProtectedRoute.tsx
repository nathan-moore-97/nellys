import { Navigate } from "react-router-dom";
import { useAuth, type AuthContextType } from "./AuthProvider";
import type { ReactNode } from "react";

export const ProtectedRoute: React.FC<{children: ReactNode}> = ({ children }) => {
    const { isAuthenticated } = useAuth() as AuthContextType;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children;
}