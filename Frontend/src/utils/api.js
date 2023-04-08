const API_ENDPOINTS = {
    AUTH_URL: 'http://localhost:3005/auth',
};

export const login = async (email, password) => {
    if (email, password) {
        try {
            const response = await fetch(`${API_ENDPOINTS.AUTH_URL}/login`, {
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
            if (result.role === "админ") {
                console.log("Admin login ==>", result);
                localStorage.setItem('token', result?.token);
                return {
                    email: result.email,
                    cashBoxID: result.cashBoxId,
                    username: result.username,
                    phoneNumber: result.phoneNumber,
                    _Id: result?.companyId?.toString(),
                    role: result?.role,
                    employers: result?.employers,
                    token: result?.token,
                };
            } else {
                localStorage.setItem('token', result?.token);
                return {
                    email: result.email,
                    cashBoxID: result.cashBoxID,
                    username: result.username,
                    phoneNumber: result.phoneNumber,
                    _Id: result?._Id?.toString(),
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
        const response = await fetch(`${API_ENDPOINTS.AUTH_URL}/protection`, {
            method: 'GET',
            headers: {
                'x-autorization': token,
            },
        });
        if (response.status !== 200) {
            return null
        }
        const result = await response.json();
        localStorage.setItem('token', result?.token);
        if (result.role === "админ") {
            localStorage.setItem('token', result?.token);
            return {
                email: result.email,
                cashBoxID: result.cashBoxID,
                username: result.username,
                _Id: result?._Id?.toString(),
                phoneNumber: result.phoneNumber,
                role: result?.role,
                employers: result?.employers,
                token: result?.token,
            };
        } else {
            localStorage.setItem('token', result?.token);
            return {
                email: result.email,
                cashBoxID: result.cashBoxID,
                username: result.username,
                phoneNumber: result.phoneNumber,
                _Id: result?._Id?.toString(),
                role: result?.role,
                token: result?.token,
            }
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};
