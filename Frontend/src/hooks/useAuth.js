import { useContext } from 'react';
import { AuthContext } from '../providers/authProvider';

export const useAuth = () => {
    const { isAuthenticated, user, isLoading, handleTokenCheck,
        handleLogin,
        handleLogout, } = useContext(AuthContext);
    return {
        isAuthenticated,
        isLoading,
        user,
        handleTokenCheck,
        handleLogin,
        handleLogout,
    };
};