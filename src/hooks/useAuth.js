import { useContext } from 'react';
import { AuthContext } from '../providers/authProvider';

export const useAuth = () => {
    const { user, isLoading, handleTokenCheck,
        companyId,
        setUser,
        handleLogin,
        handleRegister,
        handleLogout,
        handeDemoLogin,
    } = useContext(AuthContext);
    return {
        companyId,
        isLoading,
        user,
        setUser,
        handleTokenCheck,
        handleRegister,
        handleLogin,
        handleLogout,
        handeDemoLogin,
    };
};