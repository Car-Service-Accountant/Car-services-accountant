import React, { useEffect, useState } from 'react';
import { login, tokenChecker } from '../utils/api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = async (email, password) => {
        try {
            const userData = await login(email, password);
            console.log("right after logged in ");
            setUser(userData);
            setIsLoading(true);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        localStorage.clear('token');
        // TODO: send to backend token , soo we can set it to blacklist and just prevend ot reusing expired token , or something like that 
        setIsLoading(true);
        setUser(null);
    };

    useEffect(() => {
        handleLogin()
        handleLogout();
    }, [])

    const handleTokenCheck = async (token) => {
        try {
            const userData = await tokenChecker(token);
            setUser(userData);
            setIsLoading(true);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
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

