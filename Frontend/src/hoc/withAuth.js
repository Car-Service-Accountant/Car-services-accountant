import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/authProvider";

const withAuth = (Component) => (props) => {
    const { handleTokenCheck } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authorizationFn = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await handleTokenCheck(token);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        authorizationFn();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    return <Component {...props} />;

};

export default withAuth;