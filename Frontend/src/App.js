import { Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme"

import { useAuth } from "./hooks/useAuth";

import Employers from "./pages/Employers";
import Login from "./pages/Login";
import CreateCar from "./pages/CreateCar";
import CreateRepair from "./pages/CreateRepair";
import Cars from "./pages/AllCars";
import Repairs from "./pages/CarsInService";
import PendingPayments from "./pages/PendingPayments";
import withAuth from "./hoc/withAuth";
import AddEmployers from "./pages/AddEmployers";
import Dashboard from "./pages/Home";
import Sidebar from "./components/sideBar/Sidebar";
import Topbar from "./components/topBar/Topbar";
import Profile from "./pages/Profile/Profile/Profile";
import ProfileSettings from "./pages/Profile/Settings";
import Help from "./pages/Profile/Help";
import CarDetailPage from "./pages/CarDetailPage";
import RepairDetailPage from "./pages/RepairDetailPage";
import CarEditPage from "./pages/CarEditPage";
import EmployerDetailPage from "./pages/EmployerDetailPage";
import EmployerEditPage from "./pages/EmployerEditPage";


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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            {user ? <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employers" element={<Employers />} />
              <Route path="/repairs" element={<Repairs formatDate={formatDate} />} />
              <Route path="/cars" element={<Cars formatDate={formatDate} />} />
              <Route path="/pendingPayments" element={<PendingPayments formatDate={formatDate} />} />
              <Route path="/addEmployer" element={<AddEmployers />} />
              <Route path="/addCar" element={<CreateCar />} />
              <Route path="/addRepair" element={<CreateRepair />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/register" element={<p>register</p>} />
              <Route path="/login" element={<p>Error 404</p>} />
              {/* Edit / Detail pages */}
              <Route path="/employers/detail/:empId" element={<EmployerDetailPage />} />
              <Route path="/employers/edit/:empId" element={<EmployerEditPage />} />
              <Route path="/cars/:carId" element={<CarDetailPage formatDate={formatDate} />} />
              <Route path="/cars/edit/:carId" element={<CarEditPage formatDate={formatDate} />} />
              <Route path="/repair/:repairId" element={<RepairDetailPage formatDate={formatDate} />} />
            </Routes> :
              <Routes>
                <Route path="*" element={<Login />} />
                <Route path="/register" element={<p>register</p>} />
                <Route path="/login" element={<Login />} />
              </Routes>}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default withAuth(App);
