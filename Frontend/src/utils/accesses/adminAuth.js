import { useContext } from "react";
import { AuthContext } from "../../providers/authProvider";
import { Navigate } from "react-router-dom"

export const adminAuth = (Component) => {
    const WrapperComponent = (props) => {
        const { user } = useContext(AuthContext);
        if (user.role === "админ") {
            return (
                <Component {...props} />
            );
        } else {
            return <Navigate to="/" />
        }
    };
    return WrapperComponent;
};
