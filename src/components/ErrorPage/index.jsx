import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6" style={{ color: "black" }}>
        Страницата не съществува...
      </Typography>
      <Button variant="contained" onClick={handleNavigate}>
        Върнете се в началото
      </Button>
    </Box>
  );
};

export default Error;
