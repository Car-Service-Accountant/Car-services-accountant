import { useContext } from "react";
import { AuthContext } from "../../providers/authProvider";
import { Navigate } from "react-router-dom"

export const isLogedIn = (Component) => {
    const WrapperComponent = (props) => {
        const { user } = useContext(AuthContext);
        if (!user) {
            return (
                <Component {...props} />
            );
        } else {
            return <Navigate to="/login" />
        }
    };
    return WrapperComponent;
};
