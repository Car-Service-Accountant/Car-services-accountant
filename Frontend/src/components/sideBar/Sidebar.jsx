import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import CarRepairOutlinedIcon from "@mui/icons-material/CarRepairOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CreditCardOffOutlinedIcon from "@mui/icons-material/CreditCardOffOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAuth } from "../../hooks/useAuth";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useAuth();

  if (user == null) {
    return;
  }

  console.log("in side bar user ==>", user.role);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img
                  src="../../assets/logo.png"
                  alt="Missing pic"
                  height={20}
                ></img>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/demo-profile.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.username}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Табло"
              to="/"
              icon={<WidgetsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Добави кола"
              to="/addCar"
              icon={<DirectionsCarFilledOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Добави ремонт"
              to="/addRepair"
              icon={<HandymanOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Всички коли"
              to="/cars"
              icon={<NoCrashOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Коли в ремонт"
              to="/repairs" //TODO: change url if needed
              icon={<CarRepairOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {user.role !== "служител" ? (
              <>
                <Divider sx={{ my: 2 }} />
                <Item
                  title="Чакащи плащания"
                  to="/pendingPayments"
                  icon={<CreditCardOffOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Отчети"
                  to="/reports"
                  s
                  icon={<AssessmentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                  title="Допълнителни разходи"
                  to="/additionalCosts"
                  icon={<AddCardOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                {user.role === "админ" ? (
                  <>
                    <Item
                      title="Всички служители"
                      to="/employers"
                      icon={<GroupOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Добави служител"
                      to="/addEmployer"
                      icon={<GroupAddOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
