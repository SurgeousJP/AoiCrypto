import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function PaymentSelect() {
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <TouchableOpacity
      className={`flex flex-row rounded-md shadow-md items-center w-full h-[56px] justify-between p-4 bg-white`}
    >
      <View className="flex flex-row space-x-2 items-center">
        <Ionicons name="card-outline" size={24} color={"blue"} />
        <View className="border-l border-gray-200 pl-2">
          <Text className={`font-readexRegular`}>Coinmany Wallet</Text>
          <Text className="text-slate-500 text-sm font-readexRegular">
            XXXX5555
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-down" size={24} color={"gray"} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
export default PaymentSelect;
