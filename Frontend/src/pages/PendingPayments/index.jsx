import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useCashBox } from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";
import { managerAuth } from "../../utils/accesses/managerAuth";

const URL = "http://localhost:3005/car";

const PendingPayments = ({ formatDate }) => {
  const { user } = useAuth();
  const { addTotalAmount, cashBox } = useCashBox();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [repairs, setRepairs] = useState([]);

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
        const allRepairs = [];
        const unfinishedCars = data.filter((car) =>
          car.repairs.some((repair) => !repair.finished)
        );
        unfinishedCars.forEach((car) => {
          car.repairs.forEach((repair) => {
            if (!repair.paied) {
              let priceForLabor = 0;
              let priceForParts = 0;
              priceForLabor += repair.priceForLabor;
              repair.parts.forEach((part) => {
                priceForParts += part.servicePrice;
              });
              allRepairs.push({
                car,
                repair,
                totalCost: priceForLabor + priceForParts,
              });
            }
          });
        });
        setRepairs(allRepairs);
        cashBox(user.cashBoxID);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, []);

  const rows = repairs.map((repairObj) => {
    const { car, repair } = repairObj;
    return {
      repairId: repair._id,
      carId: car._id,
      owner: car.owner,
      carNumber: car.carNumber,
      phoneNumber: car.phoneNumber,
      carModel: car.carModel,
      carMark: car.carMark,
      priceForLabor: repair.priceForLabor,
      priceForParts: repair.parts.reduce(
        (sum, part) => sum + part.servicePrice,
        0
      ),
      totalCost:
        repair.priceForLabor +
        repair.parts.reduce((sum, part) => sum + part.servicePrice, 0),
    };
  });

  const handlePayment = async (repair) => {
    const paied = await addTotalAmount(user.cashBoxID, repair.totalCost);

    const updatedRepairs = {
      paied: false,
      finished: false,
      endDate: Date.now(),
    };

    if (paied) {
      updatedRepairs.paied = true;
      updatedRepairs.finished = true;
      updatedRepairs.endDate = Date.now();
    }
    console.log(repair.repairId);
    try {
      await fetch(`http://localhost:3005/repair/finished/${repair.repairId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRepairs),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          response.json();
        })
        .then((data) => {
          console.log("Car updated successfully:", data);
        })
        .catch((error) => {
          console.error(`Error updating car: ${error}`);
        });
    } catch (err) {
      console.log(err);
    }
    const updatedRepair = repairs.filter(
      (currentRepair) => currentRepair.repair._id !== repair.repairId
    );
    setRepairs(updatedRepair);
  };

  console.log(repairs);
  const columns = [
    { field: "repairId", headerName: "ID", hide: true },
    { field: "carId", headerName: "CarID", hide: true },
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
          rows={rows}
          getRowId={(row) => row.repairId}
          columns={columns}
          disableSelectionOnClick
          disableSelection
          style={{ outline: "none", boxShadow: "none" }}
        />
      </Box>
    </Box>
  );
};

export default managerAuth(PendingPayments);
