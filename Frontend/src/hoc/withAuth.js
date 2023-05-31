import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/authProvider";
import { CircularProgress } from "@mui/material";

const withAuth = (Component) => (props) => {
    const { handleTokenCheck } = useContext(AuthContext);
    const [user, setUser] = useState(undefined)
    const token = localStorage.getItem("token");


    useEffect(() => {
        const authorizationFn = async () => {
            try {
                const data = await handleTokenCheck(token);
                setUser(data)
            } catch (err) {
                setUser(null)
            }
        };
        authorizationFn();
    }, [token]);

    if (user === undefined) {
        return <CircularProgress
            style={{
                color: "#6870fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                height: "80vh",
            }}
        />
    }

    return <Component {...props} data={user} />;
};

export default withAuth;