import Capital from "@/assets/icons/system-icons-svg/Capital.svg";
import Funded from "@/assets/icons/system-icons-svg/Funded.svg";
import Participants from "@/assets/icons/system-icons-svg/Participants.svg";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import PieChartComponent from "@/components/Displays/Chart/PieChart";
import XProject from "@/components/Items/Project/XProject";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { PieChartDataItem } from "@/constants/display";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_SELLER_DASHBOARD } from "@/queries/seller_dashboard";
import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

const getProjectStatusItems = (poolData: any[]) => {
  let upcoming = 0;
  let ongoing = 0;
  let ended = 0;
  const currentTimestamp = getUnixTimestampFromDate(new Date());
  poolData.forEach((pool) => {
    if (currentTimestamp < pool.startTime) {
      upcoming = upcoming + 1;
    }
    if (currentTimestamp >= pool.endTime) {
      ended = ended + 1;
    }
    if (currentTimestamp >= pool.startTime && currentTimestamp < pool.endTime) {
      ongoing = ongoing + 1;
    }
  });
  const upcomingItem: PieChartDataItem = {
    name: "Upcoming",
    population: upcoming,
    color: colors.primary, // Yellow color for upcoming projects
    legendFontColor: "#000000", // Black text for legend
    legendFontSize: 16, // Standard font size for legend
    legendFontFamily: "ReadexPro_400Regular",
  };

  const ongoingItem: PieChartDataItem = {
    name: "Ongoing",
    population: ongoing,
    color: "#47B39C", // Blue color for ongoing projects
    legendFontColor: "#000000", // White text for legend
    legendFontSize: 16, // Standard font size for legend
    legendFontFamily: "ReadexPro_400Regular",
  };

  const endedItem: PieChartDataItem = {
    name: "Ended",
    population: ended,
    color: "#FFC154", // Red color for ended projects
    legendFontColor: "#000000", // White text for legend
    legendFontSize: 16, // Standard font size for legend
    legendFontFamily: "ReadexPro_400Regular",
  };

  return [upcomingItem, ongoingItem, endedItem];
};

const getTotalContributors = (poolData: any[]) => {
  const contributors = new Set<string>();
  poolData.forEach((pool) => {
    pool.investors.forEach((investor: any) => {
      contributors.add(investor.account.address);
    });
  });
  return contributors.size;
};

const getRaisedCapital = (poolData: any[]) => {
  return poolData.reduce((sum, pool) => sum + Number(pool.raisedAmount), 0);
};

const getSortPools = (poolData: any[]) => {
  return [...poolData]
    .sort((a, b) => b.raisedAmount - a.raisedAmount)
    .slice(0, 3);
};

const AdminDashboard = () => {
  const { address } = useContext(AuthContext);
  const {
    loading: isDashboardLoading,
    error,
    data: dashboardData,
  } = useQuery(GET_SELLER_DASHBOARD, {
    variables: { sellerAddress: address },
    skip: !address,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  const [poolData, setPoolData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    if (!isDashboardLoading && dashboardData !== undefined) {
      setPoolData(dashboardData?.idopools);
    }
  }, [isDashboardLoading, dashboardData]);

  const [sortedPools, setSortedPools] = useState<any[]>();
  useEffect(() => {
    if (poolData !== undefined) {
      setSortedPools(getSortPools(poolData));
    }
  }, [poolData]);

  if (loading || isDashboardLoading || poolData === undefined) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background ">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-background flex-1">
      <View
        className="flex items-center bg-surface py-2 px-4"
        style={{ elevation: 2 }}
      >
        <AoiCryptoLogo />
      </View>
      <View className="mt-4 ">
        <Text className="font-readexSemiBold text-md mb-2 ml-2">Overview</Text>
        <View className="">
          <View className="flex flex-row justify-between bg-surface p-4 items-center border-border border-[0.5px]">
            <View className="flex flex-row space-x-2 items-center">
              <Funded />
              <Text className="font-readexSemiBold text-black text-md">
                Total projects
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              {poolData.length}
            </Text>
          </View>

          <View className="flex flex-row justify-between bg-surface p-4  items-center">
            <View className="flex flex-row space-x-2 items-center">
              <Participants />
              <Text className="font-readexSemiBold text-black text-md">
                Participants
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              {getTotalContributors(poolData)}
            </Text>
          </View>

          <View className="flex flex-row justify-between bg-surface p-4 items-center border-border border-[0.5px]">
            <View className="flex flex-row space-x-2 items-center">
              <Capital />
              <Text className="font-readexSemiBold text-black text-md">
                Raised capital
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              {Number(getRaisedCapital(poolData)) / BIGINT_CONVERSION_FACTOR}{" "}
              <Text className=" text-secondary">ETH</Text>
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-10">
        <Text className="font-readexSemiBold text-md mb-2 ml-2">
          Funding States
        </Text>
        <View
          className="bg-surface mx-auto p-4 border-border border-[0.5px] w-full"
          style={{ elevation: 1 }}
        >
          <PieChartComponent data={getProjectStatusItems(poolData)} />
        </View>
      </View>

      <View className="mt-10 mb-3">
        <View className="ml-2 flex flex-row justify-between">
          <Text className="font-readexSemiBold text-md">
            Top 3 funded projects
          </Text>
        </View>
        {sortedPools && (
          <FlatList
            style={{ paddingHorizontal: 0 }}
            contentContainerStyle={{ flexGrow: 1, gap: 4 }}
            data={sortedPools}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              return (
                <View key={item.index} className="mt-2">
                  <XProject
                    project={item.item}
                    tokenAddress={item.item.tokenPool}
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
