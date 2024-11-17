import { colors } from "@/constants/Colors";
import { ReadexPro_400Regular, ReadexPro_700Bold } from "@expo-google-fonts/readex-pro";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";

import { LineChart } from "react-native-chart-kit";

interface ChartProps {
  data: any;
}

const Chart = () => {
  let [loaded, error] = useFonts({
    ReadexPro_400Regular,
    ReadexPro_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(47, 102, 246, ${opacity})`, // optional
        strokeWidth: 2, // optional
        
      },
    ],
    legend: ["Rainy Days"], // optional
  };
  const screenWidth = Dimensions.get("window").width;
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
      fontWeight: 'bold',
      fontFamily: 'ReadexPro_400Regular'
    },
    propsForVerticalLabels: {
      fill: colors.secondary,
      fontFamily: 'ReadexPro_400Regular'
    },
    propsForHorizontalLabels: {
      fill: colors.secondary,
      fontFamily: 'ReadexPro_400Regular'
    },
    propsForDots:{
      fill: colors.primary
    },
    propsForBackgroundLines: {
      stroke: colors.secondary,
      opacity: 0.3
    },
  };

  return (
    <LineChart
      data={data}
      width={336}
      height={256}
      verticalLabelRotation={30}
      chartConfig={chartConfig}
      bezier
    />
  );
};

export default Chart;
