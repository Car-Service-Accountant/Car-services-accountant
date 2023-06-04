import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./detail.style.css";
import { API_URL } from "../../utils/envProps";

const URL = API_URL;

const RepairDetail = ({ formatDate }) => {
  const {theme} = useTheme
  const params = useParams();
  const [repair, setRepair] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  useEffect(() => {
    fetch(`${URL}repair/${params.repairId}`, {
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
  }, [params?.repairId]);

  const columns = [
    {
      field: "typeService",
      label: "Вид ремонт",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },

    {
      field: "typeService",
      label: "Части",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "typeService",
      label: "Цени за сервиза",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "typeService",
      label: "Цени за клиента",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
    },
    {
      field: "typeService",
      label: "Цени за труда",
      flex: isMobile ? "none" : 1,
      width: isMobile ? 150 : 0,
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
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default employerAuth(RepairDetail);
