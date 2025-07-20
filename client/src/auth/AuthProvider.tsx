import React, { createContext, useContext, useEffect, useState, } from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider(props: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setIsLoading] = useState(true);

    const refreshToken = async(): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) return false;

            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Refresh error: ', error);
            return false;
        }
    }

    const loginUser = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/auth`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) return false;

            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Login error: ', error);
            return false;
        }
    }

    const logoutUser = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            console.log("Logout fired");
        } catch (error) {
            console.error('Logout error: ', error);
        } finally {
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (!(await refreshToken())) {
                    await logoutUser();
                }
            } catch (error) {
                console.error('Auth initialization error: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        const refreshInterval = setInterval(async () => {
            await refreshToken();
        }, 14 * 60 * 1000);

        return () => clearInterval(refreshInterval);

    }, [isAuthenticated]);


    const value = {
        isAuthenticated: isAuthenticated,
        isLoading: loading,
        login: loginUser,
        logout: logoutUser,
    } as AuthContextType;

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}