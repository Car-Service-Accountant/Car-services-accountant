import React, { useState } from 'react';
const baseURL = 'http://localhost:3005/auth';


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        console.log('in login auth middleware', email, password);
        fetch(`${baseURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then((response) => {
            console.log(response);
            if (response.status !== 200) {
                throw new Error("Something gone wrong");
            }
            response.json().then((result) => {
                setUser({
                    email: result.email,
                    cashBoxID: result.cashBoxID,
                    username: result.username,
                    employerID: result?.employerID?.toString()
                });
            });
        });
        setIsAuthenticated(true);
    };

    const logout = async () => {
        // TODO: send to backend token , soo we can set it to blacklist and just prevend ot reusing expired token , or something like that 
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
