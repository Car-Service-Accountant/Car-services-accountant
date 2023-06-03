import { useContext } from "react";
import { AuthContext } from "../../providers/authProvider";

export const isLogedIn = (Component) => {
    const WrapperComponent = (props) => {
        const { user } = useContext(AuthContext);
        if (!user) {
            return (
                <Component {...props} />
            );
        }
    };
    return WrapperComponent;
};
