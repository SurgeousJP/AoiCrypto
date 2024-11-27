import React from "react";
import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import Metamask from "@/assets/logos/Metamask.svg";
import { Ionicons } from "@expo/vector-icons";

interface NotificationProps {
  title: string;
  description: string;
  receiveDate: string;
}

const NotificationRow: React.FC<NotificationProps> = (props) => {
  return (
    <Pressable className="flex flex-row space-x-2 p-4 bg-surface border-border border-[0.5px]">
      <View className="flex-1 flex flex-col">
        <View className="flex flex-row space-x-2">
          <Metamask width={24} height={24} />
          <Text className="font-readexSemiBold text-sm mb-2 text-[#404040]">
            {props.title}
          </Text>
        </View>
        <Text className="font-readexRegular text-sm mb-2 text-[#404040]">
          {props.description}
        </Text>
        <Text className="font-readexRegular text-sm mb-2 text-[#404040]">
          {props.receiveDate}
        </Text>
      </View>
    </Pressable>
  );
};

export default NotificationRow;
