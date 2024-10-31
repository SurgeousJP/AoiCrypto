import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface SocialProps{
  image: ImageSourcePropType,
  content: string
}

const Social:React.FC<SocialProps> = (props) => {
  return (
    <View>
      <View className="flex flex-row bg-surface items-center mb-4 space-x-4 px-4 py-4 border-[2px] border-outline rounded-lg">
        <Image source={props.image} />
        <Text className="font-figtree">{props.content}</Text>
      </View>
    </View>
  );
};

export default Social;
