import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

function UserCard() {
  return (
    <View className="px-3.5 py-2.5 bg-white rounded-2xl shadow flex flex-row justify-between items-center border-border border-[0.5px]" style={{elevation: 2}}>
      <View className="flex flex-col justify-between">
        <View className="flex flex-row items-center">
          <Image
            className="w-10 h-10 rounded-full"
            source={{ uri: "https://via.placeholder.com/40x40" }}
          />
          <Text
            style={{
              lineHeight: 14,
            }}
            className="text-slate-900 text-sm ml-3 font-readexRegular"
          >
            Dmutro{"\n"}to***@***.com
          </Text>
        </View>
        <View className="flex flex-row items-center mt-1">
          <Text className="text-slate-900 text-sm font-readexRegular leading-none mr-1">
            ID 28954761
          </Text>
          <Ionicons name="copy-outline" size={16} color={"gray"} />
        </View>
      </View>
      <View className="p-1.5 bg-[#ccffc4] rounded-2xl justify-center items-center flex flex-row">
        <Ionicons name="checkmark-circle-outline" size={24} color={"#098c26"} />
        <View className="text-slate-900 ml-1 ">
          <Text className="text-sm font-readexRegular leading-none">Verified</Text>
        </View>
      </View>
    </View>
  );
}

export default UserCard;
