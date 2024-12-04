import React from "react";
import { Text, View } from "react-native";

interface DataRowProps {
  title: string;
  data: string;
}

function DataRow({ title, data }: DataRowProps) {
  return (
    <View className="w-full flex-row justify-between items-center">
      <Text className="text-md font-readexSemiBold">{title}</Text>
      <Text className="text-md font-readexSemiBold">{data}</Text>
    </View>
  );
}

export default DataRow;
