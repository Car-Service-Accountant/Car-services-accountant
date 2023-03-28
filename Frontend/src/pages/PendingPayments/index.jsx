import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useAddTotalMonney } from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";

const URL = "http://localhost:3005/car";

const PendingPayments = ({ formatDate }) => {
  const { user } = useAuth();
  const { addTotalAmount } = useAddTotalMonney();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cars, setCars] = useState([]);

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
          let priceForLabor = 0;
          let priceForParts = 0;
          car.repairs.forEach((repair) => {
            priceForLabor += repair.priceForLabor;
            repair.parts.forEach((part) => {
              priceForParts += part.servicePrice;
            });
          });
          const totalCost = priceForLabor + priceForParts;
          return {
            ...car,
            buildDate: formatDate(car.buildDate),
            totalCost: totalCost,
          };
        });
        setCars(formatedData);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [formatDate]);

  const handlePayment = (car) => {
    addTotalAmount(user.cashBoxID, car.totalCost);
  };

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
    {
      field: "totalCost",
      headerName: "Всичко дължимо",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={() => handlePayment(params.row)}
        >
          Плати
        </Button>
      ),
    },
  ];

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
          style={{ outline: "none", boxShadow: "none" }}
        />
      </Box>
    </Box>
  );
};

export default PendingPayments;
