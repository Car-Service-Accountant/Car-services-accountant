import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/authProvider";

const withAuth = (Component) => (props) => {
    const { isAuthenticated, handleTokenCheck } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            handleTokenCheck(token)
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <CircularProgress
                style={{
                    color: "#6870fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    height: "80vh",
                }}
            />
        );
    }

    return <Component {...props} isAuthenticated={isAuthenticated} />;
};

export default withAuth;