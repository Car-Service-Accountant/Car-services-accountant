import { useContext } from "react";
import { AuthContext } from "../../providers/authProvider";
import Unauthorized from "../../components/Unauthorized";

export const employerAuth = (Component) => {
    const WrapperComponent = (props) => {
        const { user } = useContext(AuthContext);
        if (user.role === "служител" || user.role === "мениджър" || user.role === "админ") {
            return (
                <Component {...props} />
            );
        } else {
            return <Unauthorized />
        }
    };
    return WrapperComponent;
};
