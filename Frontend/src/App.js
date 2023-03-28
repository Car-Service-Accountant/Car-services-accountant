import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sideBar/Sidebar";
import Topbar from "./components/topBar/Topbar";
import { ColorModeContext, useMode } from "./theme"
import Employers from "./pages/Employers";
import Login from "./pages/Login";
import CreateCar from "./pages/CreateCar";
import CreateRepair from "./pages/CreateRepair";
import Cars from "./pages/AllCars";
import Repairs from "./pages/CarsInService";
import PendingPayments from "./pages/PendingPayments";
import { useAuth } from "./hooks/useAuth";
import withAuth from "./middleware/withAuth";
import AddEmployers from "./pages/AddEmployers";


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // month is zero-indexed
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useAuth();

  console.log(user);
  // if (!user) {
  //   return <Navigate to="/logi"></Navigate>
  // }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<h1>Home</h1>} />
              <Route path="/employers" element={<Employers />} />
              <Route path="/repairs" element={<Repairs formatDate={formatDate} />} />
              <Route path="/cars" element={<Cars formatDate={formatDate} />} />
              <Route path="/pendingPayments" element={<PendingPayments formatDate={formatDate} />} />
              <Route path="/addEmployer" element={<AddEmployers />} />
              <Route path="/addCar" element={<CreateCar />} />
              <Route path="/addRepair" element={<CreateRepair />} />
              <Route path="/register" element={<p>register</p>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default withAuth(App);
