import { useContext } from 'react';
import { AuthContext } from '../providers/authProvider';

export const useAuth = () => {
    const { user, isLoading, handleTokenCheck,
        handleLogin,
        handleLogout, } = useContext(AuthContext);
    return {
        isLoading,
        user,
        handleTokenCheck,
        handleLogin,
        handleLogout,
    };
};