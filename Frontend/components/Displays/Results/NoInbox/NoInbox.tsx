import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NoInboxState from "@/assets/images/NoInboxState.svg";

interface NoInboxProps {
  heading?: string;
  detail?: string;
}

const NoInbox: React.FC<NoInboxProps> = (props) => {
  return (
    <View className=" bg-background flex items-center">
      <View className="m-0 p-0"><NoInboxState /></View>
      <Text className="font-readexSemiBold text-[20px] mt-[-30px] text-center">
        {props.heading ?? "No allowlist applications found"}
      </Text>
    </View>
  );
};

export default NoInbox;