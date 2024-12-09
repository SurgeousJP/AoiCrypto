import { colors } from "@/constants/colors";
import { handleCopyToClipboard } from "@/utils/clipboard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface TokenProps {
  name: string;
  symbol: string;
  initialSupply: string;
  totalSupply: string;
  address: string;
}

const TokenRow: React.FC<TokenProps> = (props) => {
  const isNumber = (str: string) => !isNaN(Number(str));

  const copyAddressToClipboard = async () => {
    await handleCopyToClipboard(props.address);
  };

  return (
    <View className="flex flex-col p-2 bg-surface border-border border-[0.5px] items-center">
      <View className="flex flex-row justify-between w-full">
        <View className="flex flex-row space-x-1">
          <Text className="font-readexBold text-sm  text-black">
            {props.name}
          </Text>
          <Text className="font-readexRegular text-sm text-secondary">
            (${props.symbol})
          </Text>
        </View>

        <Pressable className="flex flex-rowitems-center h-fit">
          <Text className="font-readexSemiBold text-sm">
            {isNumber(props.totalSupply)
              ? props.address.slice(0, 6) + ".. "
              : props.address}
            {isNumber(props.totalSupply) && (
              <TouchableOpacity onPress={copyAddressToClipboard}>
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
      <View className="flex flex-row justify-between w-full">
        <Text className="font-readexRegular text-sm">
          {Intl.NumberFormat("en-US").format(Number(props.initialSupply))}{" "}
          <Text className="text-secondary">Initially</Text>
        </Text>
        <Text className="font-readexRegular text-sm">
          {Intl.NumberFormat("en-US").format(Number(props.totalSupply))}{" "}
          <Text className="text-secondary">Max</Text>
        </Text>
      </View>
    </View>
  );
};

export default TokenRow;
