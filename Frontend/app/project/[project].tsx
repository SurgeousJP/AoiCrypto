// Import
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import PrivateSaleSegment from "@/components/Segments/ProjectDetail/PrivateSale";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getDateFromUnixTimestamp,
  getStringValueFromBigInt,
} from "@/constants/conversion";
import getABI from "@/contracts/utils/getAbi.util";
import { GET_PROJECT_BY_POOL_ID } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useReadContracts } from "wagmi";
// Import

const getBasicDataDisplay = (project: any) => {
  console.log("Basic data display: ", project);
  return [
    {
      tile: "Token address",
      data: project.tokenPool,
    },
    {
      tile: "Price per token",
      data: project.pricePerToken / BIGINT_CONVERSION_FACTOR + " ETH",
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
      data: getDateFromUnixTimestamp(project.createdTime).toLocaleString(),
    },
    {
      tile: "End time",
      data: getDateFromUnixTimestamp(project.endTime).toLocaleString(),
    },
  ];
};

const getLiquidDataDisplay = (project: any) => {
  return [
    {
      tile: "ETH to List DEX",
      data: getStringValueFromBigInt(project.liquidityWETHAmount) + " ETH",
    },
    {
      tile: "Token to List DEX",
      data: getStringValueFromBigInt(project.liquidityTokenAmount) + " ETH",
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
              project.liquidityPool.lockExpired
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
    data: query,
  } = useQuery(GET_PROJECT_BY_POOL_ID, {
    variables: {
      poolId: poolId,
    },
  });

  const project = query?.idopool;

  const tokenContract = {
    address: project?.tokenPool,
    abi: getABI("AoiERC20"),
  } as const;

  const { data: token } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: "name",
      },
      {
        ...tokenContract,
        functionName: "symbol",
      },
      {
        ...tokenContract,
        functionName: "MAX_SUPPLY",
      },
    ],
  });

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!isPrivateSale &&
      !loading &&
      project !== undefined &&
      token !== undefined ? (
        <View className="px-4 py-4">
          <View className="pt-4 flex flex-col">
            <CustomSegmentedControl
              screens={["Overview", "Token & Pool"]}
              components={[
                <Overview project={project} token={token} />,
                <TokenNPool project={project} token={token} />,
              ]}
            />
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={colors.primary} />
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
