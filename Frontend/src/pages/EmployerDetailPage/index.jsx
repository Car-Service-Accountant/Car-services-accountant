import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { adminAuth } from "../../utils/accesses/adminAuth";
import Header from "../../components/Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_URL } from "../../utils/envProps";

const URL = API_URL;

const EmployerDetails = () => {
  const params = useParams();
  const [emp, setEmp] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${URL}employers/${params.empId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEmp(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, []);

  if (emp.length === 0) {
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

  return (
    <>
      <Box m="20px" ml="10%" mr="10%">
        <Header title={`Профила на служител: ${emp.username}`} />
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src="../../assets/demo-profile.png"
            alt="Missing pic"
            height={180}
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
            value={emp.username}
            name="username"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            disabled
            variant="outlined"
            type="text"
            label="E-mail"
            value={emp.email}
            name="email"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            disabled
            variant="outlined"
            type="text"
            label="Телефонен номер"
            value={emp.phoneNumber}
            name="phoneNumber"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            disabled
            variant="outlined"
            type="text"
            label="Телефонен номер"
            value={emp.role}
            name="phoneNumber"
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt="40"></Box>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default adminAuth(EmployerDetails);
