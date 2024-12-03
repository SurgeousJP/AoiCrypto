import React from "react";
import { View, Text } from "react-native";
import EmptyState from "@/assets/images/EmptyState.svg";

interface NotFoundProps {
  heading?: string;
  detail?: string;
}

const NotFound: React.FC<NotFoundProps> = (props) => {
  return (
    <View className="mx-10 bg-background flex items-center">
      <View className="m-0 p-0"><EmptyState /></View>
      <Text className="font-readexSemiBold text-[20px] mt-[-12px]">
        {props.heading ?? "No result found"}
      </Text>
      <Text className="font-readexLight text-md text-center leading-loose">
        {props.detail ??
          "Try adjusting your search to find what you are looking for"}
      </Text>
    </View>
  );
};

export default NotFound;
