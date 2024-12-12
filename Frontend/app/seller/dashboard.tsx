import Capital from "@/assets/icons/system-icons-svg/Capital.svg";
import Funded from "@/assets/icons/system-icons-svg/Funded.svg";
import Participants from "@/assets/icons/system-icons-svg/Participants.svg";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import PieChartComponent from "@/components/Displays/Chart/PieChart";
import XProject from "@/components/Items/Project/XProject";
import { colors } from "@/constants/colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDepositLiquidityPool } from "@/hooks/smart-contract/IDOFactory/useDepositLiquidityPool";
import { GET_SELLER_DASHBOARD } from "@/queries/seller_dashboard";
import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

const AdminDashboard = () => {
  const { chainId, address, isConnected } = useContext(AuthContext);
  const {
    loading: isDashboardLoading,
    error,
    data: dashboardData,
  } = useQuery(GET_SELLER_DASHBOARD, {
    variables: { id: address },
    skip: !address,
    // fetchPolicy: "no-cache"
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || isDashboardLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background ">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }
  // console.log("Dashboard data: ", dashboardData);
  const fundedProjects = dashboardData?.poolOwners.length ?? 20;
  const participants =
    dashboardData?.poolOwners.reduce(
      (sum: number, item: any) => sum + item.idoPool.investors.length,
      0
    ) ?? 200;
  const raised =
    dashboardData?.poolOwners.reduce(
      (sum: number, item: any) => sum + item.idoPool.raised,
      0
    ) ?? 2000;

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
            <Text className="font-readexSemiBold text-black text-md">
              {fundedProjects}
            </Text>
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
            <Text className="font-readexSemiBold text-black text-md">
              {participants}
            </Text>
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
              ${raised}
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
