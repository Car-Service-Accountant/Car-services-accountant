import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
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
        Нямата необходимите права за да посетите тази страница!
      </Typography>
      <Button variant="contained" onClick={handleNavigate}>
        Върнете се в началото
      </Button>
    </Box>
  );
};

export default Unauthorized;
