import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { useReadTokenBalance } from "@/hooks/smart-contract/AoiERC20/useReadTokenBalance";
import { handleCopyToClipboard } from "@/utils/clipboard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TokenProps {
  name: string;
  symbol: string;
  initialSupply: string;
  totalSupply: string;
  address: string;
  ownerAddress: string;
  chainId: number;
}

const TokenRow: React.FC<TokenProps> = (props) => {

  const { balance } = useReadTokenBalance({
    chainId: props.chainId,
    tokenAddress: props.address,
    ownerAddress: props.ownerAddress,
    enabled: true,
  });

  const token = {
    name: props.name,
    initialSupply: props.initialSupply,
    maxSupply: props.totalSupply,
    address: props.address
  }

  const handleOnMintToken = () => {
    router.push({
      pathname: "/token/mintToken",
      params: token
    })
  };

  const copyAddressToClipboard = async () => {
    await handleCopyToClipboard(props.address);
  };

  return (
    <View className="">
      <View className="flex flex-col p-2 bg-surface border-border border-[0.5px] items-center">
        <View className="flex flex-row justify-between w-full items-baseline">
          <View className="flex flex-row space-x-1">
            <Text className="font-readexSemiBold  text-black text-md">
              {props.name}
            </Text>
            <Text className="font-readexRegular text-md text-secondary">
              (${props.symbol})
            </Text>
          </View>
          <TouchableOpacity onPress={handleOnMintToken}>
            <Ionicons name="add-outline" size={16} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <View className="self-start flex flex-row justify-between w-full">
          <Text className="font-readexRegular text-sm">Token balance: </Text>
          {balance !== undefined ? (
            <Text className="font-readexSemiBold text-sm">
              {Intl.NumberFormat("en-US").format(
                Number(balance) / BIGINT_CONVERSION_FACTOR
              )}{" "}
            </Text>
          ) : (
            <ActivityIndicator
              size={"small"}
              color={colors.primary}
            ></ActivityIndicator>
          )}
        </View>

        <View className="flex flex-row justify-between w-full">
          <Text className="font-readexRegular text-sm">Token address: </Text>
          <Text className="font-readexSemiBold text-sm">
            {props.address.slice(0, 8) + ". . . "}
            <TouchableOpacity onPress={copyAddressToClipboard}>
              <Ionicons
                name="copy-outline"
                size={12}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </Text>
        </View>
        <View className="flex flex-row justify-between w-full">
          <Text className="font-readexRegular text-sm">
            Token supply range:{" "}
          </Text>
          <Text className="font-readexSemiBold text-sm">
            {Intl.NumberFormat("en-US").format(Number(props.initialSupply))}
            {" - "}
            {Intl.NumberFormat("en-US").format(Number(props.totalSupply))}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TokenRow;
