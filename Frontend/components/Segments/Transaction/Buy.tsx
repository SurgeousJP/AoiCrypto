import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import QuantityCard from "@/components/Cards/QuantityCard/QuantityCard";
import PaymentSelect from "@/components/PaymentSelect/PaymentSelect";
import React from "react";
import { Text, View } from "react-native";

function Buy() {
  return (
    <View className="flex-1 flex flex-col justify-between">
      <View>
        <View className="flex flex-col items-center">
          <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
            You Pay
          </Text>
          <Text className="text-blue-600 text-3xl font-bold font-readexRegular leading-9">
            $1.000
          </Text>
        </View>
        <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
          You Receive
        </Text>
        <QuantityCard quantity={0.040141} currency="BTC" />
        <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
          Payment Methods Available
        </Text>
        <PaymentSelect />
      </View>
      <PaymentSelect />
      <View className="w-screen h-24 border-t p-4 border-gray-300 bg-white absolute bottom-0 -left-4">
        <PrimaryButton
          onPress={() => console.log("Button pressed")}
          content="BUY"
        />
      </View>
    </View>
  );
}

export default Buy;
