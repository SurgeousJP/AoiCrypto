import DisplayBox from "@/components/Displays/DisplayBox/DisplayBox";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getStringValueFromBigInt,
  getDateFromUnixTimestamp,
} from "@/constants/conversion";
import React from "react";
import { View, ActivityIndicator } from "react-native";

interface Props {
  project: any;
  token: any;
}

const getTokenDataDisplay = (project: any, token: any) => {
  const [name, symbol, maxSupply] = token?.map((token) => token.result) || [
    "Loading...",
  ];
  return [
    {
      tile: "Address",
      data: project.tokenPool,
    },
    {
      tile: "Name",
      data: name,
    },
    {
      tile: "Symbol",
      data: "$" + symbol,
    },
    {
      tile: "Max total supply",
      data: Intl.NumberFormat("en-US").format(
        Number(maxSupply) / BIGINT_CONVERSION_FACTOR
      ),
    },
    {
      tile: "Price per token",
      data:
        1 / (Number(project.pricePerToken) / BIGINT_CONVERSION_FACTOR) + " ETH",
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
      tile: "Start time",
      data: getDateFromUnixTimestamp(project.startTime).toLocaleString(),
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
      tile: "Pool address",
      data: project.id,
    },
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

const TokenNPool: React.FC<Props> = ({ project, token }) => {
  return (
    <View className="w-full">
      {token ? (
        <DisplayBox
          values={getTokenDataDisplay(project, token)}
          title={"Token"}
        />
      ) : (
        <ActivityIndicator size={"large"} color={colors.primary} />
      )}
      <DisplayBox values={getSaleDataDisplay(project)} title={"Sale info"} />
      <DisplayBox values={getLiquidDataDisplay(project)} title={"Pool info"} />
    </View>
  );
};

export default TokenNPool;
