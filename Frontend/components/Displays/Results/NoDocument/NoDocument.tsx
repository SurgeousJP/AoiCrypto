import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NoDocumentState from "@/assets/images/NoDocumentState.svg";

interface NoDocumentProps {
  heading?: string;
  detail?: string;
}

const NoDocument: React.FC<NoDocumentProps> = (props) => {
  return (
    <View className="mx-10 bg-white flex items-center">
      <View className="m-0 p-0"><NoDocumentState /></View>
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

export default NoDocument;
