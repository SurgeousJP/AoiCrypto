import Container from "@/components/Layouts/Container";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
interface WarningCardProps {
  iconColor: string;
  content: string;
}

function WarningCard({ iconColor, content }: WarningCardProps) {
  return (
    <Container>
      <View className="p-3.5 bg-white rounded-md  justify-center flex flex-row space-x-1 items-center border-border border-[1px]">
        <Ionicons name="warning-outline" size={24} color={iconColor} />
        <Text className="self-stretch text-black text-sm font-readexLight leading-none">
          {content}
        </Text>
      </View>
    </Container>
  );
}

export default WarningCard;
