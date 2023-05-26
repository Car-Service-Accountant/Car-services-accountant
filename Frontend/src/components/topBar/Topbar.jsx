import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, handleLogout } = useAuth();

  if (user == null) {
    return;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onLogoutClock = async () => {
    await handleLogout();
    console.log("logout ");
    setAnchorEl(null);
    return <Navigate to="/login" />;
  };

  const handleMenuClose = async () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" justifyContent="right" p={2}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton component={Link} to="/notification">
          <NotificationsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
            <Typography>Профил</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
            <Typography>Настройки</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/help">
            <Typography>Помощ</Typography>
          </MenuItem>
          <MenuItem onClick={onLogoutClock} component={Link} to="/login">
            <Typography>Изход</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
