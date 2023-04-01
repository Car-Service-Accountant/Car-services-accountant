import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/authProvider";

const withAuth = (Component) => (props) => {
    const { handleTokenCheck } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authorizationFn = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await handleTokenCheck(token);
            } else {
                console.error("Missing auth token , please login");
            }
            setLoading(false);
        };
        authorizationFn();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return <Component {...props} />;

};

export default withAuth;