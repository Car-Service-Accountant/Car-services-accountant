import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { Navigate } from "react-router-dom";

const URL = "http://localhost:3005/car";

const Repairs = ({ formatDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cars, setCars] = useState([]);
  const [selecredRow, setSelectedRow] = useState(null);

  const handleRowClick = (params) => {
    if (params.field !== "Action") {
      setSelectedRow(params.id);
    }
  };

  useEffect(() => {
    fetch(URL, {
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
  }, [formatDate]);

  const columns = [
    { field: "_id", headerName: "ID", hide: true },
    {
      field: "owner",
      headerName: "Име на клиента",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Телефон на клиента",
      flex: 1,
    },
    {
      field: "carMark",
      headerName: "Марка на колата",
      flex: 1,
    },
    {
      field: "carModel",
      headerName: "Модел на колата",
      flex: 1,
    },
    {
      field: "carNumber",
      headerName: "Номер на колата",
      flex: 1,
    },
    {
      field: "buildDate",
      headerName: "Година на производство",
      flex: 1,
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
    </Box>
  );
};

export default employerAuth(Repairs);
