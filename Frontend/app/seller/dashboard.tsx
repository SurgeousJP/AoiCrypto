import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import Funded from "@/assets/icons/system-icons-svg/Funded.svg";
import Participants from "@/assets/icons/system-icons-svg/Participants.svg";
import Capital from "@/assets/icons/system-icons-svg/Capital.svg";
import PieChartComponent from "@/components/Displays/Chart/PieChart";
import XProject from "@/components/Items/Project/XProject";
import { AuthContext } from "@/contexts/AuthProvider";

const AdminDashboard = () => {
  const { chainId, address, isConnected } = useContext(AuthContext);

  return (
    <ScrollView className="bg-background flex-1">
      <View
        className="flex items-center bg-surface py-2 px-4"
        style={{ elevation: 2 }}
      >
        <AoiCryptoLogo />
      </View>
      <View className="p-4">
        <Text className="font-readexSemiBold text-md mb-2">Overview</Text>
        <View className="">
          <View
            className="flex flex-row justify-between bg-surface border-border border-[0.5px] p-4 rounded-lg items-center"
            style={{ elevation: 2 }}
          >
            <View className="flex flex-row space-x-2 items-center">
              <Funded />
              <Text className="font-readexRegular text-black text-md">
                Funded Projects
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">20</Text>
          </View>

          <View
            className="flex flex-row justify-between bg-surface border-border border-[0.5px] p-4 rounded-lg items-center mt-2"
            style={{ elevation: 2 }}
          >
            <View className="flex flex-row space-x-2 items-center">
              <Participants />
              <Text className="font-readexRegular text-black text-md">
                Participants
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">200</Text>
          </View>

          <View
            className="flex flex-row justify-between bg-surface border-border border-[0.5px] p-4 rounded-lg items-center mt-2"
            style={{ elevation: 2 }}
          >
            <View className="flex flex-row space-x-2 items-center">
              <Capital />
              <Text className="font-readexRegular text-black text-md">
                Raised Capital
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              $2000
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="font-readexSemiBold text-md mb-2">Funding Trends</Text>
        <View
          className="bg-surface p-4 border-border border-[1px] rounded-lg"
          style={{ elevation: 2 }}
        >
          <PieChartComponent />
        </View>
      </View>

      <View className="p-4">
        <View className="flex flex-row justify-between">
          <Text className="font-readexSemiBold text-md">
            Top 3 Funded Projects
          </Text>
        </View>
        <View className="mt-2">
          <XProject />
        </View>
        <View className="mt-2">
          <XProject />
        </View>
        <View className="mt-2">
          <XProject />
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
