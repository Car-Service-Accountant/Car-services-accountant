import { useContext } from "react";
import { AuthContext } from "../../providers/authProvider";
import Unauthorized from "../../components/Unauthorized";

export const managerAuth = (Component) => {
    const WrapperComponent = (props) => {
        const { user } = useContext(AuthContext);
        if (user.role === "мениджър" || user.role === "админ") {
            return (
                <Component {...props} />
            );
        } else {
            return <Unauthorized />
        }
    };
    return WrapperComponent;
};
