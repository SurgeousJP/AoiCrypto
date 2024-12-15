import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tokens = [
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "CAKE", name: "PancakeSwap Token" },
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "BTCB", name: "Binance Bitcoin" },
];

const SwapScreen = () => {
  const insets = useSafeAreaInsets();
  const [fromToken, setFromToken] = useState("BNB");
  const [toToken, setToToken] = useState("CAKE");
  const [amount, setAmount] = useState("");
  const [toAmount, setToAmount] = useState("110.25");
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount(toAmount);
    setToAmount("");
  };

  const openTokenPicker = () => setIsPickerVisible(true);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b-[0.5px] border-border  shadow-md">
        <ScreenHeader
          LeftComponent={
            <View className="opacity-0">
              <Back stroke={colors.secondary} width={20} height={20} />
            </View>
          }
          CenterComponent={
            <Text className="text-[20px] font-readexSemiBold text-center">
              Swap
            </Text>
          }
          RightComponent={
            <Link href="/settings">
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          }
        />
      </View>

      <ScrollView className="py-6">
        {/* From Token Input */}
        <View className=" bg-white border border-gray-300 p-3">
          <View className="mb-8">
            <Text className="text-sm text-gray-500 font-readexSemiBold mb-2">From</Text>
            <View className="flex-row items-center border justify-between border-gray-200 rounded-lg px-2 py-1 bg-[#eeeaf4]">
              <TouchableOpacity
                className="flex-row items-center space-x-1 "
                onPress={openTokenPicker}
              >
                <Text className="text-md font-readexSemiBold">{fromToken}</Text>
                <Ionicons name={"chevron-down"} size={18} />
              </TouchableOpacity>
              <View className="items-end w-2/3">
                <TextInput
                  placeholder="0.0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  className="flex-1 w-full text-lg p-1 text-black font-readexBold text-right"
                />
                <Text className="text-xs font-readexSemiBold text-gray-500">
                  ~3,818.87 USD
                </Text>
              </View>
            </View>
          </View>
          {/* Horizontal Line */}
          <View className="border-b border-gray-300 mb-4"></View>
          {/* Swap Icon */}
          <TouchableOpacity
            onPress={handleSwapTokens}
            className="self-center p-2 bg-primary rounded-full shadow-lg -mt-9"
          >
            <Ionicons name="swap-vertical" size={20} color="white" />
          </TouchableOpacity>
          {/* To Token Input */}
          <View className="mb-6">
            <Text className="text-sm text-gray-500 font-readexSemiBold mb-2">To</Text>
            <View className="flex-row items-center border justify-between border-gray-200 rounded-lg px-2 py-1 bg-[#eeeaf4]">
              <TouchableOpacity
                className="flex-row items-center space-x-1"
                onPress={openTokenPicker}
              >
                <Text className="text-base font-readexSemiBold">{toToken}</Text>
                <Ionicons name={"chevron-down"} size={18} />
              </TouchableOpacity>
              <View className="items-end w-2/3">
                <TextInput
                  placeholder="0.0"
                  value={toAmount}
                  onChangeText={setToAmount}
                  keyboardType="numeric"
                  className="flex-1 w-full text-lg p-1 text-black font-readexBold text-right"
                />
                <Text className="text-xs font-readexSemiBold text-gray-500">
                  ~3,818.87 USD
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Token Picker Modal */}
        <Modal visible={isPickerVisible} animationType="slide">
          <View className="flex-1 bg-white p-6">
            <TextInput
              placeholder="Search or paste address"
              value={tokenAddress}
              onChangeText={setTokenAddress}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <ScrollView className="max-h-80">
              {tokens.map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  onPress={() => {
                    setFromToken(token.symbol);
                    setIsPickerVisible(false);
                  }}
                  className="flex-row items-center justify-between py-3 border-b border-gray-200"
                >
                  <Text className="text-base">{token.symbol}</Text>
                  <Text className="text-sm text-gray-500">{token.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setIsPickerVisible(false)}
              className="mt-4 p-3 bg-primary rounded-lg"
            >
              <Text className="text-white text-center font-readexSemiBold">Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View className=" bg-white border mt-4 border-gray-300 p-3">
          <PrimaryButton
            onPress={function (): void {
              throw new Error("Function not implemented.");
            }}
            content={"Swap"}
          />
          <TouchableOpacity
            onPress={() => {
              console.log("Advanced Details clicked");
              setIsDetailsVisible(!isDetailsVisible);
            }}
            className="flex-row items-center justify-center my-2 mr-3"
          >
            <Text className="text-gray-600 text-xs font-readexRegular  w-full text-right">
              Fee 0.002499 ETH
            </Text>
            <Ionicons
              name={!isDetailsVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color={"#4b5563"}
            />
          </TouchableOpacity>
          <Collapsible collapsed={isDetailsVisible}>
            {/* Wallet information content */}
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600 text-xs font-readexSemiBold">
                Maximum sold
              </Text>
              <Text className="text-gray-600 text-xs font-readexSemiBold">
                1.004 ETH
              </Text>
            </View>
          </Collapsible>
        </View>
      </ScrollView>
    </View>
  );
};

export default SwapScreen;
