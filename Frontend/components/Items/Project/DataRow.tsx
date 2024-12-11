import React from "react";
import { Text, View } from "react-native";

interface DataRowProps {
  title: string;
  data: string;
}

function DataRow({ title, data }: DataRowProps) {
  return (
    <View className="w-full flex-row justify-between items-center">
      <Text className="text-sm font-readexRegular text-secondary">{title}</Text>
      <Text className="text-sm font-readexRegular text-black">{data}</Text>
    </View>
  );
}

export default DataRow;
