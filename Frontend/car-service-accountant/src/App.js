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


function App() {
  const [theme, colorMode] = useMode();

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
              <Route path="/login" element={<Login />} />
              <Route path="/addEmployer" element={<Register />} />
              <Route path="/addCar" element={<CreateCar />} />
              <Route path="/employers" element={<Employers />} />
              <Route path="/addRepair" element={<CreateRepair />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
