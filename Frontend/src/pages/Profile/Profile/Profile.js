import {
    Box, TextField, useMediaQuery,
} from "@mui/material";
import Header from "../../../components/Header/Header";
import { employerAuth } from "../../../utils/accesses/employerAuth";
import { useAuth } from "../../../hooks/useAuth";

const Profile = () => {

    const { user } = useAuth();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    return (
        <>
            <Box m="20px" ml="10%" mr="10%"
            >
                <Header
                    title={`Здравейте ${user.username}`}
                />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <img
                        src="../../assets/demo-profile.png"
                        alt="Missing pic"
                        height={180}
                        onClick={() => console.log("possible to change from there if left time")}
                    ></img>
                </Box>

                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    marginTop="2%"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        type="text"
                        label="Име на служителя"
                        value={user.username}
                        name="username"
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        type="text"
                        label="E-mail"
                        value={user.email}
                        name="email"
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        type="text"
                        label="Телефонен номер"
                        value={user.phoneNumber}
                        name="phoneNumber"
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        type="text"
                        label="Телефонен номер"
                        value={user.role}
                        name="phoneNumber"
                        sx={{ gridColumn: "span 2" }}
                    />

                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                </Box>

            </Box >
        </>
    );
};

export default employerAuth(Profile);
