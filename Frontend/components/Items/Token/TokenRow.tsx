import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { showToast } from "@/utils/toast";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface TokenProps {
  name: string;
  symbol: string;
  totalSupply: string;
  address: string;
}

const TokenRow: React.FC<TokenProps> = (props) => {
  const isNumber = (str: string) => !isNaN(Number(str));

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(props.address);
    const clipboard = await Clipboard.getStringAsync();
    showToast("info", "Copied address to clipboard", clipboard);
  };

  return (
    <View className="flex flex-row space-x-2 p-4 bg-surface border-border border-[0.5px] items-center">
      <Text className="font-readexRegular text-sm  text-[#404040] w-12">
        {props.name}
      </Text>
      <Text className="font-readexRegular text-sm text-[#404040] w-16">
        {props.symbol}
      </Text>
      <Text className="font-readexRegular text-sm text-[#404040] flex-1">
        {isNumber(props.totalSupply)
          ? Intl.NumberFormat("en-US").format(
              Number(props.totalSupply)
            )
          : props.totalSupply}
      </Text>
      <Pressable className="flex flex-row flex-1 items-center h-fit">
        <Text className="font-readexRegular text-sm text-[#404040]">
          {isNumber(props.totalSupply) ? props.address.slice(0,6) + ".. " : props.address}
          {isNumber(props.totalSupply) && (
            <TouchableOpacity onPress={handleCopyToClipboard}>
              <Ionicons
                name="copy-outline"
                size={14}
                color={colors.secondary}
              />
            </TouchableOpacity>
          )}
        </Text>
      </Pressable>
    </View>
  );
};

export default TokenRow;
