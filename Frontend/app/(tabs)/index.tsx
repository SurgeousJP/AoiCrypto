import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import ProjectCard from "@/components/Items/Project/ProjectCard";
import XProject from "@/components/Items/Project/XProject";
import { colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDepositLiquidityPool } from "@/hooks/smart-contract/IDOFactory/useDepositLiquidityPool";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TransactionReceipt } from "viem";

export default function HomeScreen() {
  const banner = require("@/assets/logos/Kima.png");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading((loading) => false);
  }, []);

  const { chainId, address, isConnected } = useContext(AuthContext);

  const {
    error: error,
    isLoading: isLoading,
    onDepositLiquidityPool: onExecute,
  } = useDepositLiquidityPool({
    chainId: chainId,
    poolId: 1700200000000n,
    enabled: true,
    onSuccess: (data: TransactionReceipt) => {
      console.log("Test executing smart contract successfully");
    },
    onSettled: (data?: TransactionReceipt) => {
      console.log("Test settled smart contract successfully");
    },
    onError: (error?: Error) => {
      console.log("An error occurred: ", error);
    },
  });

  useEffect(() => {
    console.log("Hook loading status: ", isLoading);
    console.log("Hook error: ", error);
  }, [isLoading, error]);

  const onTestClick = async () => {
    console.log("Test smart contract started");
    try {
      await onCreateIDO();
      console.log("IDO creation initiated...");
    } catch (error) {
      console.error("Error while executing smart contract :", error);
    }
    console.log("Test smart contract ended");
  };

  if (loading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex flex-col px-4 bg-background">
      <View className="rounded-2xl mt-4">
        <View className="w-full rounded-2xl h-fit">
          <Image
            source={banner}
            style={{
              flex: 1,
              width: "100%",
              height: 112,
              borderRadius: 16,
            }}
          />
        </View>
      </View>

      <View className="flex flex-col mt-4">
        <View className="flex flex-row justify-between mb-1">
          <Text className="text-textColor text-md font-readexBold">
            Upcoming Projects
          </Text>
          <Pressable>
            <Text className="text-md font-readexSemiBold text-primary">
              More
            </Text>
            <Text className="text-md font-readexSemiBold text-primary">
              More
            </Text>
          </Pressable>
        </View>
        <View className="flex flex-row space-x-2">
          <View className="flex-1 overflow-visible">
            <ProjectCard />
          </View>
          <View className="flex-1 overflow-visible">
            <ProjectCard />
          </View>
        </View>
        <View className="flex flex-col mt-4 mb-2">
          <Pressable className="mt-4 mb-4">
            <NormalButton
              content={
                createIDOIsLoading
                  ? "Loading create IDO hook..."
                  : "Test Smart Contract"
              }
              onClick={onTestClick}
            />
          </Pressable>
          <View className="flex flex-row justify-between mb-1">
            <Text className="text-textColor text-md font-readexBold">
              Funded Projects
            </Text>
            <Pressable>
              <Text className="text-md font-readexSemiBold text-primary">
                More
              </Text>
            </Pressable>
          </View>
          <View className="flex flex-col">
            <Pressable className="mb-2">
              <XProject />
            </Pressable>
            <Pressable className="mb-2">
              <XProject />
            </Pressable>
            <Pressable className="mb-2">
              <XProject />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
