import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import Header from "../../components/Header/Header";
import StatBox from "../../components/StatBox";
import { useEffect, useState } from "react";
import finishedToday from "../../utils/repairs/finishedToday";
import finishedDayBefore from "../../utils/repairs/finishedDayBefore";
import finishedThisMonth from "../../utils/repairs/finishedThisMonth";
import finishedMonthBefore from "../../utils/repairs/finishedMonthBefore";
import finishedThisWeek from "../../utils/repairs/finishedThisWeek";
import finishedLastWeek from "../../utils/repairs/finishedWeekBefore";
import sortByDateAndCalculateProfit from "../../utils/repairs/sortByDateAndCalculateProfit";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";

const URL = API_URL;

const Dashboard = ({ formatDate }) => {
  const theme = useTheme();
  const [repairs, setRepairs] = useState([]);
  const {companyId} = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl"));


  useEffect(() => {
    fetch(`${URL}repair`, {
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
        setRepairs(data);
      })
      .catch((error) => {
        console.error(`Error fetching employers: ${error}`);
      });
  }, [companyId, repairs]);

  //Today's profit
  let paiedTodayData = {};
  if (repairs.length > 0) {
    paiedTodayData = finishedToday(repairs);
  }
  //Profit for prevous day
  let paiedYestardayData = {};
  if (repairs.length > 0) {
    paiedYestardayData = finishedDayBefore(repairs);
  }

  const proggressBarForToday =
    paiedTodayData.totalProfitToday - paiedYestardayData.totalYestardayProfit;
  //Profit for this month
  let paiedThisMonthData = {};
  if (repairs.length > 0) {
    paiedThisMonthData = finishedThisMonth(repairs);
  }

  //Profit for  month before
  let paiedMonthBeofreData = {};
  if (repairs.length > 0) {
    paiedMonthBeofreData = finishedMonthBefore(repairs);
  }

  const proggressBarForThisMonth =
    paiedThisMonthData.totalProfitForThisMonth -
    paiedMonthBeofreData.totalProfitForMotnthBefore;

  //this Week profit
  let paiedThisWeekData = {};
  if (repairs.length > 0) {
    paiedThisWeekData = finishedThisWeek(repairs);
  }

  //Week before
  let paiedWeekBeofreData = {};
  if (repairs.length > 0) {
    paiedWeekBeofreData = finishedLastWeek(repairs);
  }

  const proggressBarForThisWeek =
    paiedThisWeekData.totalProfitForThisWeek -
    paiedWeekBeofreData.totalProfitForMotnthBefore;

  let carProggressThisMonth = 0;
  if (
    paiedThisMonthData.repairsThisMonth &&
    paiedMonthBeofreData.repairsInMonthBefore
  ) {
    carProggressThisMonth =
      (paiedThisMonthData?.repairsThisMonth -
        paiedMonthBeofreData?.repairsInMonthBefore) *
      100;
  }

  let sortedRepairs = [];
  if (repairs.length > 0) {
    sortedRepairs = sortByDateAndCalculateProfit(repairs);
  }

  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Обща информазия за сервиза" />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows={ isMobile ? "103px" : "144px"}
        gap="13px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`+ ${paiedTodayData?.totalProfitToday || 0} лв.`}
            subtitle="Дневен доход"
            progress={proggressBarForToday / 10000}
            increase={`${proggressBarForToday / 100 > 0 ? "+" : ""} ${
              proggressBarForToday / 100 || ""
            } %`}
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`+ ${paiedThisWeekData?.totalProfitForThisWeek || 0} лв.`}
            subtitle="Седмичен профит"
            progress={proggressBarForThisWeek / 10000}
            increase={`${proggressBarForThisWeek / 100 > 0 ? "+" : ""} ${
              proggressBarForThisWeek / 100 || ""
            } %`}
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`+ ${paiedThisMonthData?.totalProfitForThisMonth || 0}`}
            subtitle="Месечен разход"
            progress={proggressBarForThisMonth / 10000}
            increase={`${proggressBarForThisMonth / 100 > 0 ? "+" : ""} ${
              proggressBarForThisMonth / 100 || ""
            } %`}
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={paiedThisMonthData?.repairsThisMonth ||0}
            subtitle="Ремонтирани коли за този месец"
            progress={carProggressThisMonth / 100}
            increase={`${carProggressThisMonth > 0 ? "+" : ""} ${
              carProggressThisMonth || "0"
            } %`}
            icon={
              <NoCrashIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
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
              Последни плащания
            </Typography>
          </Box>
          {sortedRepairs?.calculatedRepairs?.map((repair, i) => (
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
                  {repair.service[0]}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{formatDate(repair.endDate)}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {`${repair.partsDifference + repair.priceForLabor ? "+" : ""} ${
                  repair.partsDifference + repair.priceForLabor
                } лв.`}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default employerAuth(Dashboard);
