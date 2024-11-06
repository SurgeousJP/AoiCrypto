import React, { useEffect, useState } from "react";
import { Text, Pressable, Image, View } from "react-native";

interface CustomButtonProps {
  backgroundColor: string;
  textColor: string;
  iconTintColor?: string;
  content: string;
  isReverse?: true | false;
}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
  const sendIcon = require("../../assets/icons/system-icons/send.png");
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    if (props.isReverse === undefined) {
      setIsReverse(false);
    } else {
      setIsReverse(props.isReverse);
    }
  }, []);

  return (
    <Pressable
      className={`flex flex-row items-center justify-center space-x-2 w-[156px] h-12 rounded-xl ${props.backgroundColor} `}
    >
      {isReverse && (
        <View className="flex flex-row space-x-2 items-center">
          <Image
            className="w-5 h-5"
            source={sendIcon}
            style={{ tintColor: `${props.iconTintColor}` }}
          />
          <Text
            className={`${props.textColor} font-readexBold text-center text-md my-auto`}
          >
            {props.content}
          </Text>
        </View>
      )}

      {!isReverse && (
        <View className="flex flex-row space-x-2 items-center">
          <Text
            className={`${props.textColor} font-readexBold text-center text-md my-auto`}
          >
            {props.content}
          </Text>
          <Image
            className="w-5 h-5"
            source={sendIcon}
            style={{ tintColor: `${props.iconTintColor}` }}
          />
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;
