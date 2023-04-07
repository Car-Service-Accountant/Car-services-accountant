import { Box, CircularProgress, TextField, useMediaQuery } from "@mui/material";
import { adminAuth } from "../../utils/accesses/adminAuth";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EMPLOYERS_URL = "http://localhost:3005/employers";

const EmployerDetails = () => {
  const params = useParams();
  console.log(params.empId);
  const [emp, setEmp] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    fetch(`${EMPLOYERS_URL}/${params.empId}`, {
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
        <Header title={`Здравейте ${emp.username}`} />
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src="../../assets/demo-profile.png"
            alt="Missing pic"
            height={180}
            onClick={() =>
              console.log("possible to change from there if left time")
            }
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
        <Box display="flex" justifyContent="center" mt="20px"></Box>
      </Box>
    </>
  );
};

export default adminAuth(EmployerDetails);
