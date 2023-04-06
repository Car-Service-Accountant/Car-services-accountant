import {
  Box,
  CircularProgress,
  Grid,
  Menu,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { Navigate, useParams } from "react-router-dom";
import "./detail.style.css";

const URL = "http://localhost:3005/repair";

const RepairDetail = ({ formatDate }) => {
  const params = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [repair, setRepair] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selecredRow, setSelectedRow] = useState(null);

  const handleRowClick = ({ rows, columns }) => {
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
    console.log(`Editing car with id ${selectedId}`);
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    fetch(`${URL}/${selectedId}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        const updatedCars = repair.filter((car) => car._id !== selectedId);

        setRepair(updatedCars);
      }
    });
    handleMenuClose();
  };

  useEffect(() => {
    fetch(`${URL}/${params.repairId}`, {
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
        setRepair(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, []);

  if (selecredRow) {
    return <Navigate to={`/cars/repair/${selecredRow}`} />;
  }

  const columns = [
    {
      field: "typeService",
      label: "Вид ремонт",
      flex: 1,
    },

    {
      field: "typeService",
      label: "Части",
      flex: 1,
    },
    {
      field: "typeService",
      label: "Цени за сервиза",
      flex: 1,
    },
    {
      field: "typeService",
      label: "Цени за клиента",
      flex: 1,
    },
    {
      field: "typeService",
      label: "Цени за труда",
      flex: 1,
    },
  ];

  if (repair.length === 0) {
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

  let counter =
    repair.parts.length > repair.service.length
      ? repair.parts.length
      : repair.service.length;

  const totalClientPrice = repair.parts.reduce((total, part) => {
    return total + part.clientPrice;
  }, 0);

  const profit = repair.parts.reduce((profit, part) => {
    return (profit = part.clientPrice - part.servicePrice);
  }, 0);

  console.log(repair);
  return (
    <Box m="20px">
      <Header title={`Всички детайли за ремонта`} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#8DC8FC" }}>
              {columns.map((column) => (
                <TableCell key={column.id} id={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{repair.service[0]}</TableCell>
              <TableCell>{repair.parts[0].partName}</TableCell>
              <TableCell>{repair.parts[0].servicePrice}лв</TableCell>
              <TableCell>{repair.parts[0].clientPrice}лв</TableCell>
              <TableCell>{repair.priceForLabor}лв</TableCell>
            </TableRow>
            {Array.from({ length: counter - 1 }).map((_, index) => (
              <TableRow key={index + 1}>
                <TableCell>{repair.service[index + 1]}</TableCell>
                <TableCell>{repair.parts[index + 1].partName}</TableCell>
                <TableCell>{repair.parts[index + 1].servicePrice}лв</TableCell>
                <TableCell>{repair.parts[index + 1].clientPrice}лв</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#8DC8FC" }}>
              <TableCell>Цена на ремонта</TableCell>
              <TableCell>Чиста печалба</TableCell>
              <TableCell>Взета кола</TableCell>
              <TableCell>Платено</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell>{repair.priceForLabor + totalClientPrice}лв</TableCell>
            <TableCell>{profit + repair.priceForLabor}лв</TableCell>
            <TableCell style={{ color: repair.finished ? "green" : "red" }}>
              {repair.finished ? <DoneIcon /> : <ClearIcon />}
            </TableCell>
            <TableCell style={{ color: repair.paied ? "green" : "red" }}>
              {repair.paied ? <DoneIcon /> : <ClearIcon />}
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default employerAuth(RepairDetail);
