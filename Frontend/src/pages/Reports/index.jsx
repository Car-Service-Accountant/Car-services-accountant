import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { managerAuth } from "../../utils/accesses/managerAuth";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";

const URL = API_URL

const Report = ({ formatDate }) => {
  const theme = useTheme();
  const [cars, setCars] = useState([]);
  const {companyId} = useAuth();

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
        setCars(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [companyId]);

  function calculateRepairCost(cars) {
    for (const car of cars) {
      for (const repair of car.repairs) {
        let partsCost = 0;
        let serviceCost = 0;

        for (const part of repair.parts) {
          partsCost += part.clientPrice;
          serviceCost += part.servicePrice;
        }

        const laborCost = repair.priceForLabor || 0;
        const totalCost = partsCost - serviceCost + laborCost;

        repair.totalRepairCost = totalCost;
      }
    }

    return cars;
  }

  let totalProfit = 0;
  cars.forEach((car) => {
    car.repairs.forEach((repair) => {
      totalProfit += repair.totalRepairCost;
    });
  });

  const newCars = calculateRepairCost(cars);
  const repairsWithCars = newCars.flatMap((car) => {
    return car.repairs.map((repair) => {
      return {
        ...repair,
        car: {
          carMark: car.carMark,
          carModel: car.carModel,
          carNumber: car.carNumber,
          owner: car.owner,
          phoneNumber: car.phoneNumber,
        },
      };
    });
  });

  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Подробна информация за ремонтите" />
      </Box>

      <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        overflow="auto"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Общ брои ремонти : {repairsWithCars?.length}
          </Typography>
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Сумиран профит : {totalProfit} лв.
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Последни плащания
          </Typography>
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Чиста печалба
          </Typography>
        </Box>
        {repairsWithCars.map((repair, i) => (
          <Box
            key={`${repair._id}-${i}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                {repair.car.carNumber}
              </Typography>
              <Typography
                color={colors.primary[500]}
              >{`Марка на колата :${repair.car.carMark} ${repair.car.carModel}`}</Typography>
              <Typography
                color={colors.primary[500]}
              >{`Собственик: ${repair.car.owner}`}</Typography>
              <Typography
                color={colors.primary[500]}
              >{`Телефон: ${repair.car.phoneNumber}`}</Typography>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="600">
                {formatDate(repair.endDate)}
              </Typography>
            </Box>
            <Box
              backgroundColor={
                repair.paied ? colors.greenAccent[500] : colors.redAccent[500]
              }
              p="5px 10px"
              borderRadius="4px"
            >
              {`${repair.paied ? "+" : "-"} ${repair.totalRepairCost} лв.`}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default managerAuth(Report);
