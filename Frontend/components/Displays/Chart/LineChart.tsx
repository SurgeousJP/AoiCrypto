import { colors } from "@/constants/colors";
import {
  ReadexPro_400Regular,
  ReadexPro_700Bold,
} from "@expo-google-fonts/readex-pro";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, View, Text } from "react-native";

import { LineChart } from "react-native-chart-kit";

interface LineChartProps {
  input: number[];
}

const LineChartComponent:React.FC<LineChartProps> = ({input}) => {
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
    labels: [],
    datasets: [
      {
        // data: [20, 45, 28, 80, 120, 43],
        data: input,
        color: (opacity = 1) => `rgba(47, 102, 246, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Total ETH raised"], // optional
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
    decimalPlaces: 4
  };

  return (
    <LineChart
      data={data}
      width={336}
      height={256}
      verticalLabelRotation={30}
      chartConfig={chartConfig}
      bezier
      fromZero={true}
      renderDotContent={({ x, y, index, indexData }) => {
        console.log("Index data: ", indexData);
        return (
          <View key={index} style={[{ position: "absolute", left: x-5, top: y+16 }]}>
            <Text className="font-readexSemiBold text-black text-[10px]">{indexData}</Text>
          </View>
        );
      }}
    />
  );
};

export default LineChartComponent;
