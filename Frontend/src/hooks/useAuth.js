import { useContext } from 'react';
import { AuthContext } from '../middleware/authProvider';

export const useAuth = () => {
    const { isAuthenticated, user, login, logout } = useContext(AuthContext);

    return {
        isAuthenticated,
        user,
        login,
        logout,
    };
};