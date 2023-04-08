import React, { useEffect, useState } from 'react';
import { login, tokenChecker } from '../utils/api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleRegister = async (userInfo) => {
        if (userInfo.role === "админ") {
            localStorage.setItem('token', userInfo?.token);
            setUser({
                email: userInfo.email,
                cashBoxID: userInfo.cashBoxId,
                username: userInfo.username,
                _Id: userInfo?.companyId?.toString(),
                role: userInfo?.role,
                employers: userInfo?.employers,
                userInfo: userInfo?.userInfo,
            });
        } else {
            localStorage.setItem('token', userInfo?.token);
            setUser({
                email: userInfo.email,
                cashBoxID: userInfo.cashBoxID,
                username: userInfo.username,
                _Id: userInfo?._Id?.toString(),
                role: userInfo?.role,
                userInfo: userInfo?.userInfo,
            })
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const userData = await login(email, password);
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
            return userData
        } catch (err) {
            throw new Error("Someting gone wrong")
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                setUser,
                handleTokenCheck,
                handleRegister,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

