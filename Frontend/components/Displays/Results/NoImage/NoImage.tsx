import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NoImageState from "@/assets/images/NoImageState.svg";

interface NoImageProps {
  heading?: string;
  detail?: string;
}

const NoImage: React.FC<NoImageProps> = (props) => {
  return (
    <View className="mx-2 bg-white flex items-center">
      <View className="m-0 p-0">
        <NoImageState />
      </View>
      <Text className="font-readexSemiBold text-md mt-[-12px]">
        {props.heading ?? "No image available"}
      </Text>
      {/* <Text className="font-readexLight text-sm text-center leading-loose">
        {props.detail ?? "Start upload image by click the button below"}
      </Text> */}
    </View>
  );
};

export default NoImage;
