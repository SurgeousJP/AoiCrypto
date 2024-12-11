// Import
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import PrivateSaleSegment from "@/components/Segments/ProjectDetail/PrivateSale";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import { getDateFromUnixTimestamp, getStringValueFromBigInt } from "@/constants/conversion";
import { GET_PROJECT_BY_POOL_ID } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
// Import

const getBasicDataDisplay = (project: any) => {
  return [
    {
      tile: "Token address",
      data: project.tokenPool,
    },
    {
      tile: "Price per token",
      data: project.pricePerToken,
    },
  ];
};

const getSaleDataDisplay = (project: any) => {
  return [
    {
      tile: "Sale type",
      data: project.idoType === "PUBLIC_SALE" ? "Public sale" : "Private sale",
    },
    {
      tile: "Soft Cap",
      data: getStringValueFromBigInt(project.softCap) + " ETH",
    },
    {
      tile: "Hard Cap",
      data: getStringValueFromBigInt(project.hardCap) + " ETH",
    },
    {
      tile: "Min Invest",
      data: getStringValueFromBigInt(project.minInvest) + " ETH",
    },
    {
      tile: "Max Invest",
      data: getStringValueFromBigInt(project.maxInvest) + " ETH",
    },
  ];
};

const getSaleConfigDataDisplay = (project: any) => {
  return [
    {
      tile: "Start time",
      data: getDateFromUnixTimestamp(
        project.createdTime
      ).toLocaleString(),
    },
    {
      tile: "End time",
      data: getDateFromUnixTimestamp(
        project.endTime
      ).toLocaleString(),
    }
  ];
};

const getLiquidDataDisplay = (project: any) => {
  return [
    {
      tile: "ETH to List DEX",
      data:
        getStringValueFromBigInt(project.liquidityWETHAmount) + " ETH",
    },
    {
      tile: "Token to List DEX",
      data:
        getStringValueFromBigInt(project.liquidityTokenAmount) + " ETH",
    },
    {
      tile: "Action for List DEX",
      data: project.liquidityPool.action,
    },
    ...(project.liquidityPool.action === "LOCK"
      ? [
          {
            tile: "Lock Expired",
            data: getDateFromUnixTimestamp(
              project.lockExpired
            ).toLocaleString(),
          },
        ]
      : []),
  ];
};

const ProjectDetail = () => {
  const isPrivateSale = false;
  const params = useLocalSearchParams();
  const { poolId } = params;

  const {
    loading,
    error,
    data: project,
  } = useQuery(GET_PROJECT_BY_POOL_ID, {
    variables: {
      poolId: poolId,
    },
  });

  console.log("Pool id: ", poolId);

  useEffect(() => {
    console.log(project);
  }, [project]);

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!isPrivateSale && (
        <View className="px-4 py-4">
          <View className="pt-4 flex flex-col">
            <CustomSegmentedControl
              screens={["Overview", "Description", "Token & Pool"]}
              components={[<Overview />, <Description />, <TokenNPool />]}
            />
          </View>
        </View>
      )}

      {isPrivateSale && (
        <View className="p-4">
          <PrivateSaleSegment />
        </View>
      )}
    </ScrollView>
  );
};

export default ProjectDetail;
