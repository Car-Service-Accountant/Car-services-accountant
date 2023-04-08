import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../providers/authProvider";
import { CircularProgress } from "@mui/material";

const withAuth = (Component) => (props) => {
    const { handleTokenCheck } = useContext(AuthContext);
    const [user, setUser] = useState(undefined)

    let data = undefined
    useEffect(() => {
        const authorizationFn = async () => {
            const token = localStorage.getItem("token");
            try {
                data = await handleTokenCheck(token);
                setUser(data)
            } catch (err) {
                console.error(err);
            }
        };
        authorizationFn();
    }, []);

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