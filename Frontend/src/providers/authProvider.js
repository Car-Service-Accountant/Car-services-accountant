import React, { useState } from 'react';
import { login, tokenChecker } from '../utils/api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = async (email, password) => {
        try {
            const userData = await login(email, password);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        // TODO: send to backend token , soo we can set it to blacklist and just prevend ot reusing expired token , or something like that 
        setIsAuthenticated(false);
        setIsLoading(false);
        setUser(null);
    };

    const handleTokenCheck = async (token) => {
        try {
            const userData = await tokenChecker(token);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                handleTokenCheck,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

