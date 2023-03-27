import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sideBar/Sidebar";
import Topbar from "./components/topBar/Topbar";
import { ColorModeContext, useMode } from "./theme"
import Employers from "./pages/Employers";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateCar from "./pages/CreateCar";
import CreateRepair from "./pages/CreateRepair";
import Cars from "./pages/AllCars";
import Repairs from "./pages/CarsInService";
import PendingPayments from "./pages/PendingPayments";
import { AuthProvider } from "./middleware/authProvider";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // month is zero-indexed
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <div className="app">
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/login" element={<Login />} />
                <Route path="/employers" element={<Employers />} />
                <Route path="/repairs" element={<Repairs formatDate={formatDate} />} />
                <Route path="/cars" element={<Cars formatDate={formatDate} />} />
                <Route path="/pendingPayments" element={<PendingPayments formatDate={formatDate} />} />
                <Route path="/addEmployer" element={<Register />} />
                <Route path="/addCar" element={<CreateCar />} />
                <Route path="/addRepair" element={<CreateRepair />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
