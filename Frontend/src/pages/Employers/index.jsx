import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState } from "react";
import { adminAuth } from "../../utils/accesses/adminAuth";
import { Navigate } from "react-router-dom";
import { SnackbarContext } from "../../providers/snackbarProvider";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";

const URL = API_URL;

const Employers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employers, setEmployers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selecredRow, setSelectedRow] = useState(null);
  const [editId, setEditId] = useState(null);
  const showSnackbar = useContext(SnackbarContext);
  const {companyId} = useAuth();

  const handleRowClick = (params) => {
    if (params.field !== "Action") {
      setSelectedRow(params.id);
    }
  };

  const handleMenuOpen = (event) => {
    setSelectedId(event.currentTarget.dataset.id);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedId(null);
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditId(selectedId);
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    fetch(`${URL}employers/${selectedId}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        const updatedEmployers = employers.filter(
          (employer) => employer._id !== selectedId
        );
        setEmployers(updatedEmployers);
        showSnackbar("Успешно премахнахте служителя");
      }
    });
    handleMenuClose();
  };

  useEffect(() => {
    fetch(`${URL}employers/cmp/${companyId}`, {
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
        setEmployers(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [companyId]);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0,
      hide: true,
    },
    {
      field: "username",
      headerName: "Име на служителя",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phoneNumber",
      headerName: "Телефонен номер",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Ниво на достъп",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="65%"
            m="0 auto"
            p="7px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin"
                ? colors.greenAccent[600]
                : role === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {role === "manager" && <SecurityOutlinedIcon />}
            {role === "staff" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Action",
      headerName: "",
      sortable: false,
      width: 0,
      renderCell: (params) => (
        <IconButton
          size="large"
          onClick={handleMenuOpen}
          data-id={params.row._id}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  if (employers.length === 0) {
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

  if (editId) {
    return <Navigate to={`/employers/edit/${editId}`} />;
  }
  if (selecredRow) {
    return <Navigate to={`/employers/detail/${selecredRow}`} />;
  }

  return (
    <Box m="20px">
      <Header title="Служители" subtitle="Управление на служителите" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={employers}
          getRowId={(employer) => employer._id}
          columns={columns}
          disableSelectionOnClick
          disableSelection
          onCellDoubleClick={handleRowClick}
          style={{ outline: "none", boxShadow: "none" }}
        />
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>
            <ModeEditOutlineOutlinedIcon fontSize="small" />
            <Typography variant="body1" ml={1}>
              Edit
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteForeverOutlinedIcon fontSize="small" />
            <Typography variant="body1" ml={1}>
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default adminAuth(Employers);
