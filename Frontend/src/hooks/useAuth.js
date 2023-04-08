import { useContext } from 'react';
import { AuthContext } from '../providers/authProvider';

export const useAuth = () => {
    const { user, isLoading, handleTokenCheck,
        setUser,
        handleLogin,
        handleRegister,
        handleLogout, } = useContext(AuthContext);
    return {
        isLoading,
        user,
        setUser,
        handleTokenCheck,
        handleRegister,
        handleLogin,
        handleLogout,
    };
};