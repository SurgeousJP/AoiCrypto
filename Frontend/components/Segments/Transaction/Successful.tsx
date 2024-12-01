import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import ExchangeRateCard from "@/components/Cards/ExchangeCard/ExchangeRateCard";
import React from "react";
import { Image, Text, View } from "react-native";

function Successful() {
  return (
    <View className="flex-1 flex flex-col items-center">
      <Image
        className="w-full h-1/2"
        source={require("../../../assets/images/successful.png")}
      />
      <Text className="w-80 text-center text-slate-900 text-3xl font-semibold font-readexRegular leading-9">
        Exchange Successful
      </Text>
      <Text className="w-80 text-center mt-2 text-slate-900 text-sm font-normal leading-none">
        You have successfully initiated the transaction. Amount will reflect in
        wallet within 1 hour
      </Text>
      <View className="mt-4">
        <ExchangeRateCard
          fromCurrencyQuantity={0.040141}
          fromCurrencyName={"Bitcoin BTC"}
          toCurrencyQuantity={0.689612}
          toCurrencyName={"Ethereum ETH"}
        />
      </View>
      <View className="w-screen h-24 border-t p-4 border-gray-300 bg-white absolute bottom-0 -left-4">
        <PrimaryButton
          onPress={() => console.log("Button pressed")}
          content="Done"
        />
      </View>
    </View>
  );
}

export default Successful;
