import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";

const URL = API_URL;

const Repairs = ({ formatDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cars, setCars] = useState([]);
  const [selecredRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const { companyId } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleRowClick = (params) => {
    if (params.field !== "Action") {
      setSelectedRow(params.id);
    }
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
        const unfinishedCars = data.filter((car) =>
          car.repairs.some((repair) => !repair.finished)
        );
        const formatedData = unfinishedCars.map((car) => {
          return {
            ...car,
            buildDate: formatDate(car.buildDate),
          };
        });
        setCars(formatedData);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [companyId, formatDate]);

  const columns = [
    { field: "_id", headerName: "ID", hide: true },
    {
      field: "owner",
      headerName: "Име на клиента",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "phoneNumber",
      headerName: "Телефон на клиента",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "carMark",
      headerName: "Марка на колата",
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
      field: "buildDate",
      headerName: "Година на производство",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
  ];

  if (selecredRow) {
    return <Navigate to={`/cars/${selecredRow}`} />;
  }

  return (
    <Box m="20px">
      <Header
        title="Коли в ремонт"
        subtitle="Коли по който се работи в момента"
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={cars}
          getRowId={(employer) => employer._id}
          columns={columns}
          disableSelectionOnClick
          disableSelection
          onCellDoubleClick={handleRowClick}
          style={{ outline: "none", boxShadow: "none" }}
        />
      </Box>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default employerAuth(Repairs);
