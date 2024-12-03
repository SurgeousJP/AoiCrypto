import { colors } from "@/constants/colors";
import React from "react";
import { PieChart } from "react-native-chart-kit";

const PieChartComponent = () => {
  const data = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.surface,
    backgroundGradientToOpacity: 0.5,
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientFromOpacity: 0.3,
    fillShadowGradientTo: colors.primary,
    fillShadowGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(105, 111, 140, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForLabels: {
      fill: colors.textColor,
      fontWeight: "bold",
      fontFamily: "ReadexPro_400Regular",
    },
    propsForVerticalLabels: {
      fill: colors.secondary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForHorizontalLabels: {
      fill: colors.secondary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForDots: {
      fill: colors.primary,
    },
    propsForBackgroundLines: {
      stroke: colors.secondary,
      opacity: 0.3,
    },
    accessor: 'population'
  };

  return (
    <PieChart
      data={data}
      width={360}
      height={256}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
    />
  );
};

export default PieChartComponent;
