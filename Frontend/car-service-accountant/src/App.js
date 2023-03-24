import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Employers from "./components/Employers/Employers";
import Sidebar from "./components/sideBar/Sidebar";
import Topbar from "./components/topBar/Topbar";
import { ColorModeContext, useMode } from "./theme"


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
              <Route path="/employers" element={<Employers />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
