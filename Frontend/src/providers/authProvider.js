import React, { useEffect, useState } from 'react';
import { login, tokenChecker } from '../utils/api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const collectProffileData = (userInfo) => {
        if (userInfo) {
            if (userInfo?.role === "админ") {
                localStorage.setItem('token', userInfo?.token);
                setUser({
                    email: userInfo?.email,
                    cashBoxID: userInfo?.cashBoxID,
                    username: userInfo?.username,
                    _Id: userInfo?._Id,
                    role: userInfo?.role,
                    employers: userInfo?.employers,
                    userInfo: userInfo?.userInfo,
                });
            } else {
                localStorage.setItem('token', userInfo?.token);
                setUser({
                    email: userInfo?.email,
                    cashBoxID: userInfo?.cashBoxID,
                    username: userInfo?.username,
                    _Id: userInfo?._Id?.toString(),
                    role: userInfo?.role,
                    userInfo: userInfo?.userInfo,
                })
            }
        } else {
            setUser(null)
        }
    }

    const handleRegister = async (userInfo) => {
        if (userInfo) {
            collectProffileData(userInfo)
        } else {
            return collectProffileData(null)
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const userData = await login(email, password);
            collectProffileData(userData);
            setIsLoading(true);
        } catch (err) {
            collectProffileData(null);
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
            collectProffileData(userData);
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

