import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useState } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleClose = () => {
        setIsOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setIsOpen(true);
        setMessage(message);
        setSeverity(severity);
    };

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};