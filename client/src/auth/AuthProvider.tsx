import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export interface AuthTokenResponse {
    accessToken: string;
    // Add other fields if your API returns more data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

const refreshToken = async(): Promise<boolean> => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json() as AuthTokenResponse;

    if (data.accessToken) {
        setToken(data.accessToken);
        return true;
    } 
    
    return false;
}

    const loginUser = async (username: string, password: string): Promise<boolean> => {
        const response = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({username, password})
        });

        const data = await response.json() as AuthTokenResponse;

        if (data.accessToken) {
            setToken(data.accessToken);
            return true;
        } 

        return false;
    }

    const logoutUser = async () => {
        await fetch(`${API_URL}/auth`, {
            method: 'POST',
            credentials: 'include'
        });

        setToken(null);
    }

    useEffect(() => {
        refreshToken();
    }, []);


    const value = {
        token: token,
        isAuthenticated: !!token,
        login: loginUser,
        logout: logoutUser,
    } as AuthContextType;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);