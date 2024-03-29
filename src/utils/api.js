import { API_URL } from "./envProps";

const URL = API_URL
export const login = async (email, password) => {
    if (email && password) {
        try {
            const response = await fetch(`${URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.status !== 200) {
                return null
            }
            const result = await response.json();
            localStorage.setItem('token', result?.token);
            if (result?.role === "админ") {
                return {
                    email: result.email,
                    cashBoxID: result.cashBoxId,
                    username: result.username,
                    phoneNumber: result.phoneNumber,
                    _id: result?.companyId?.toString(),
                    role: result?.role,
                    employers: result?.employers,
                    token: result?.token,
                };
            } else if (result) {
                return {
                    email: result.email,
                    cashBoxID: result.cashBoxID,
                    username: result.username,
                    phoneNumber: result.phoneNumber,
                    _id: result?._id?.toString(),
                    role: result?.role,
                    token: result?.token,
                }
            }

        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

export const tokenChecker = async (token) => {

    try {
        const response = await fetch(`${URL}auth/protection`, {
            method: 'GET',
            headers: {
                'x-autorization': token,
            },
        });
        if (response.status !== 200) {
            return null
        }
        const result = await response.json();
        if (result) {
            return result
        }
    } catch (err) {
        throw err;
    }
};
