import { Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";

interface SocialProps {
  imageUri: string;
  content: string;
}

const Social: React.FC<SocialProps> = (props) => {
  return (
    <View>
      <View className="flex flex-row bg-surface items-center mb-4 space-x-4 px-4 py-4 border-[2px] border-outline rounded-lg ">
        <Image source={{ uri: props.imageUri }} width={24} height={24}/>
        <Text className="font-readexRegular">{props.content}</Text>
      </View>
    </View>
  );
};

export default Social;
