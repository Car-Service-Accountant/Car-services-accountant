import React, { useState } from 'react';
import { login, tokenChecker } from '../utils/api';

export const AuthContext = React.createContext();
const DEMOEMAIL = "demomail@gmail.com"
const DEMOPASSWORD = "demoPassword"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [companyId, setComplayId] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const collectProffileData = (userInfo) => {
        if (userInfo) {
            localStorage.setItem('token', userInfo?.token);
            if (userInfo?.role === "админ") {
                setUser({
                    email: userInfo?.email,
                    cashBoxID: userInfo?.cashBoxID,
                    username: userInfo?.username,
                    _id: userInfo?._id,
                    role: userInfo?.role,
                    employers: userInfo?.employers,
                })
                setComplayId(userInfo?._id);
            } else {
                setUser({
                    email: userInfo?.email,
                    phoneNumber: userInfo?.phoneNumber,
                    cashBoxID: userInfo?.cashBoxID,
                    username: userInfo?.username,
                    _id: userInfo?._id?.toString(),
                    role: userInfo?.role,
                })
                setComplayId(userInfo?.companyId)
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
            return true
        } catch (err) {
            collectProffileData(null);
            setIsLoading(false);
            return false
        }
    };

    const handeDemoLogin = async () => {
        handleLogin(DEMOEMAIL, DEMOPASSWORD)
    }

    const handleLogout = async () => {
        localStorage.clear('token');
        // TODO: send to backend token , soo we can set it to blacklist and just prevend ot reusing expired token , or something like that 
        setIsLoading(true);
        setUser(null);
    };

    const handleTokenCheck = async (token) => {
        try {
            const userData = await tokenChecker(token);
            collectProffileData(userData);
            setIsLoading(true);
            return userData
        } catch (err) {
            return null
        }
    };

    return (
        <AuthContext.Provider
            value={{
                companyId,
                user,
                isLoading,
                setUser,
                handleTokenCheck,
                handleRegister,
                handleLogin,
                handleLogout,
                handeDemoLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

