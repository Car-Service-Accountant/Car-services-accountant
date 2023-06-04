import { Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useCashBox } from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";
import { managerAuth } from "../../utils/accesses/managerAuth";
import { useContext } from "react";
import { SnackbarContext } from "../../providers/snackbarProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/envProps";

const URL = API_URL;

const PendingPayments = ({ formatDate }) => {
  const { user, companyId } = useAuth();
  const { addTotalAmount, cashBox } = useCashBox();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [repairs, setRepairs] = useState([]);
  const showSnackbar = useContext(SnackbarContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

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
      buildDate: formatDate(car.buildDate),
      priceForLabor: repair.priceForLabor,
      priceForParts: repair.parts.reduce(
        (sum, part) => sum + part.servicePrice,
        0
      ),
      totalCost:
        repair.priceForLabor +
        repair.parts.reduce((sum, part) => sum + part.clientPrice, 0),
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
    try {
      await fetch(`${URL}repair/finished/${repair.repairId}`, {
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
          showSnackbar("Успешно направихте плащането", "success");
        })
        .catch((error) => {
          showSnackbar("Неуспешно плащане", "error");
        });
    } catch (err) {
      console.error("someting gone wrong");
    }
    const updatedRepair = repairs.filter(
      (currentRepair) => currentRepair.repair._id !== repair.repairId
    );
    setRepairs(updatedRepair);
  };

  const columns = [
    { field: "repairId", headerName: "ID", hide: true },
    { field: "carId", headerName: "CarID", hide: true },
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
    {
      field: "totalCost",
      headerName: "Всичко дължимо",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
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
        title="Очакващи плащане."
        subtitle="Коли който вече са приключини ,но все още не платени."
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
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default managerAuth(PendingPayments);
