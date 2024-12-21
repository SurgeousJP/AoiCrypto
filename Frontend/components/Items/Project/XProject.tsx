import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import getABI from "@/contracts/utils/getAbi.util";
import React from "react";
import { View, Image, Text } from "react-native";
import { useReadContracts } from "wagmi";

interface Props {
  project: any;
  tokenAddress: string;
}

const XProject: React.FC<Props> = ({ project, tokenAddress }) => {
  const projectLogo = require("@/assets/images/ProjectLogo.png");

  const tokenContract = {
    address: tokenAddress as `0x${string}`,
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
    ],
  });

  const [name, symbol] = token?.map((token) => token.result) || ["Loading..."];

  return (
    <View
      id="project-card"
      className="flex flex-row h-fit w-full bg-surface  overflow-hidden py-2 px-4 items-center justify-between border-border border-[0.5px]"
      style={{ elevation: 1 }}
    >
      <View className="flex flex-row space-x-2 items-center">
        <Image source={projectLogo} className="w-8 h-8" />
        <View className="flex flex-col">
          <Text className="font-readexRegular text-md">{name?.toString()}</Text>
          <Text className="font-readexRegular text-sm text-secondary">
            ${symbol?.toString()}
          </Text>
        </View>
      </View>
      <View className="flex flex-col">
        <Text className="font-readexBold text-md flex-1 text-right">
          {project.raisedAmount / BIGINT_CONVERSION_FACTOR} <Text className="text-secondary">ETH</Text>
        </Text>
        <Text className="font-readexRegular text-sm flex-1 text-right text-success">
          {project.investors.length} funders
        </Text>
      </View>
    </View>
  );
};

export default XProject;
