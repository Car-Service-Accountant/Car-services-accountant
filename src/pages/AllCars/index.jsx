import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  Typography,
  useTheme,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../providers/snackbarProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";

const URL = API_URL

const Cars = ({ formatDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cars, setCars] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editedId, setEditedId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selecredRow, setSelectedRow] = useState(null);
  const showSnackbar = useContext(SnackbarContext);
  const { companyId } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const navigate = useNavigate();

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
    setEditedId(selectedId);
  };

  const handleDeleteClick = async () => {
    fetch(`${URL}car/${selectedId}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        const updatedCars = cars.filter((car) => car._id !== selectedId);
        showSnackbar(`Успешно премахнахте колата!`, "success");
        setCars(updatedCars);
      }
    });
    handleMenuClose();
  };

  useEffect(() => {
    fetch(`${URL}car`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formatedData = data.map((car) => {
          return {
            ...car,
            buildDate: formatDate(car.buildDate),
          };
        });
        if (formatedData.length !== 0) {
          setCars(formatedData);
        } else {
          setCars(null)
        }
      })
      .catch((error) => {
        console.error(`Error fetching cars`);
      });
  }, [companyId]);

  if (editedId) {
    return <Navigate to={`/cars/edit/${editedId}`} />;
  }

  if (selecredRow) {
    return <Navigate to={`/cars/${selecredRow}`} />;
  }

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "owner",
      headerName: "Собственик",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "buildDate",
      headerName: "Дата на производство",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "carMark",
      headerName: "Марка на колата ",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "carModel",
      headerName: "Модел на колата",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "carNumber",
      headerName: "Номер на колата",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "carVIN",
      headerName: "Вин на колата",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "Action",
      headerName: "",
      disableColumnSelector: true,
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
  if (cars === null) {
    return <Typography variant="h1" style={{ display: "flex", justifyContent: "space-around", marginTop: "90px" }}>Все още няма създадени коли</Typography>
  }
  if (cars.length === 0) {
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
  return (
    <Box m="20px">
      <Header
        title="Всички коли"
        subtitle="Коли който някога са били в този сервиз"
      />
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
          "& .MuiDataGrid-row": {
            display: "flex",
            flexWrap: "nowrap",
            minWidth: "270px!important",
            "& div": {
            },
          },
        }}
      >
        <DataGrid
          rows={cars}
          getRowId={(cars) => cars._id}
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
              Промяна
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteForeverOutlinedIcon fontSize="small" />
            <Typography variant="body1" ml={1}>
              Премахване
            </Typography>
          </MenuItem>
        </Menu>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default employerAuth(Cars);
