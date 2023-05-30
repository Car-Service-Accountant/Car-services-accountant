import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./detail.style.css";
import { useContext } from "react";
import { SnackbarContext } from "../../providers/snackbarProvider";
import { API_URL } from "../../utils/envProps";

const URL = API_URL

const CarDetails = ({ formatDate }) => {
  const params = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [car, setCar] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selecredRow, setSelectedRow] = useState(null);
  const showSnackbar = useContext(SnackbarContext);
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

  const handleDeleteClick = async () => {
    try {
      fetch(`${URL}repair/${selectedId}`, {
        method: "DELETE",
        //to fix resave state after delete
      }).then((response) => {
        if (response.status === 200) {
          const updatedCars = car.repairs.filter(
            (repair) => repair._id !== selectedId
          );
          showSnackbar("Успешно изтриване на ремпнта", "success");
          setCar(updatedCars);
        }
      });
    } catch (err) {
      showSnackbar("Нещо се обурка", "error");
    }
    handleMenuClose();
  };

  useEffect(() => {
    fetch(`${URL}car/${params.carId}`, {
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
        setCar(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [params]);

  if (selecredRow) {
    return <Navigate to={`/repair/${selecredRow}`} />;
  }

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0,
      hide: true,
    },

    {
      field: "createDate",
      headerName: "Дата",
      flex: 1,
      valueGetter: (params) => formatDate(params.value),
    },

    {
      field: "service",
      headerName: "Ремонт",
      flex: 1,
    },
    {
      field: "parts",
      headerName: "Части",
      flex: 1,
      valueGetter: (params) =>
        params.value.map((part) => part.partName).join(", "),
    },
    {
      field: "priceForLabor",
      headerName: "Цена на ремонта",
      flex: 1,
    },
    {
      field: "totalPrice",
      headerName: "Профит",
      flex: 1,
      valueGetter: (params) => {
        let total = params.row.priceForLabor;
        params.row.parts.forEach((part) => {
          total += part.clientPrice - part.servicePrice;
        });
        return total;
      },
    },
    {
      field: "paied",
      headerName: "Платено",
      flex: 0,
      renderCell: (params) => (
        <>
          <div
            style={{
              color: params.row.paied ? "green" : "red",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <svg width="20" height="20">
              <rect
                display="block"
                width="20"
                height="20"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
              />
              <text x="8" y="15" fill="currentColor">
                {params.row.paied ? "✔" : "X"}
              </text>
            </svg>
          </div>
          <IconButton
            size="large"
            onClick={handleMenuOpen}
            data-id={params.row._id}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (car.length === 0) {
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
        title={`Всички ремонти на: ${car.carNumber} - ${car.carMark} ${car.carModel}`}
      />
      <Box
        m="5px 0 0 0"
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
          rows={car.repairs}
          getRowId={(employer) => employer._id}
          columns={columns}
          onCellDoubleClick={handleRowClick}
          disableSelectionOnClick
          disableSelection
          disableRowClickSelect
          disableHover
          getRowClassName={(params) => (params.row.paied ? "paid" : "unpaid")}
          style={{ outline: "none", boxShadow: "none" }}
        />
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDeleteClick}>
            <DeleteForeverOutlinedIcon fontSize="small" />
            <Typography variant="body1" ml={1}>
              Премахване
            </Typography>
          </MenuItem>
        </Menu>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default employerAuth(CarDetails);
