import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const LineChart = ({ isDashboard = false, repairs }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const data = repairs.reduce((acc, repair) => {
    // Convert end date to a Unix timestamp in seconds
    const timestamp = new Date(repair.endDate).getTime() / 1000;
    // Add a data point for each day between create date and end date
    for (
      let day = 0;
      day <= (timestamp - repair.endDate) / (2 * 24 * 3600);
      day++
    ) {
      const date = new Date((repair.endDate + day * 2 * 24 * 3600) * 1000);
      const dateString = date.toISOString().substr(0, 10);
      // Find existing data point for this date or create a new one
      const pointIndex = acc.findIndex((d) => d.x === dateString);
      if (pointIndex === -1) {
        acc.push({ x: dateString, y: 0 });
      }
      // Increment the count of repairs for this date
      acc[pointIndex].y++;
    }
    return acc;
  }, []);
  return (
    <ResponsiveLine
      data={[
        {
          id: "repairs",
          color: tokens("dark").greenAccent[500],
          data,
        },
      ]}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );
};

export default LineChart;
