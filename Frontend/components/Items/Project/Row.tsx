import React from "react";
import { View, Text } from "react-native";

interface RowProps {
  contents: { value: string; style: string }[];
}

const Row: React.FC<RowProps> = ({ contents }) => {
  return (
    <View key={Math.random()} className="flex flex-row bg-surface border-border border-[0.5px]">
      {contents.map((content, index) => {
        return (
          <View className={`flex-1 px-4 py-3 ${content.style}`}>
            <Text className={`text-center ${content.style} `}>
              {content.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default Row;
