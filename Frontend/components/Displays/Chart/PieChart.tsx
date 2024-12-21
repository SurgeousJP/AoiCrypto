import { colors } from "@/constants/colors";
import { PieChartDataItem } from "@/constants/display";
import React from "react";
import { PieChart } from "react-native-chart-kit";

interface Props {
  data: PieChartDataItem[]
}

const PieChartComponent:React.FC<Props> = ({data}) => {

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
      fill: colors.primary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForVerticalLabels: {
      fill: colors.primary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForHorizontalLabels: {
      fill: colors.primary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForDots: {
      fill: colors.primary,
      fontFamily: "ReadexPro_400Regular",
    },
    propsForBackgroundLines: {
      stroke: colors.secondary,
      opacity: 0.3,
    },
    accessor: "population",
    fontFamily: "ReadexPro_400Regular"
  };

  return (
    <PieChart
      data={data}
      width={400}
      height={256}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
    />
  );
};

export default PieChartComponent;
