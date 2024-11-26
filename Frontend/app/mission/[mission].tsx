import Container from "@/components/Layouts/Container";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import * as Progress from "react-native-progress";
import { colors } from "@/constants/Colors";
import MissionTask from "@/components/Items/Mission/MissionTask";
import X from "@/assets/logos/X.svg";
import Telegram from "@/assets/logos/Telegram.svg";
import AoiCoin from "@/assets/logos/AoiCoin.svg";
import { AuthContext } from "@/contexts/AuthProvider";
import { router } from "expo-router";

const MissionDetail = () => {
  const [isRendering, setRendering] = useState(true);
  useEffect(() => {
    setRendering(false);
  }, []);

  const userContext = useContext(AuthContext);
  useEffect(() => {
    if (
      !isRendering &&
      !userContext.isLoading &&
      userContext.status !== "connected"
    ) {
      router.push("/login");
    }
  }, [userContext, isRendering]);

  if (isRendering) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }
  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4 ">
        <Container>
          <View className="flex flex-col bg-surface w-full p-4 pb-2 rounded-lg">
            <View className="flex flex-row justify-between items-center mb-2">
              <AoiCryptoLogo height={28} />
              <Text className="font-readexRegular text-secondary">
                No end date
              </Text>
            </View>
            <Text className="font-readexBold text-md mb-2">Onboarding</Text>
            <Text className="font-readexRegular mb-1">
              Welcome to the brand new AoiCrypto experience!
            </Text>
            <Text className="font-readexRegular">
              Missions are LIVE now and you are among the first to explore it,
              complete all the tasks and get an exclusive 500 POLS Power reward
              for 60 days.  
            </Text>
            <View className="ml-auto">
              <Text className="flex-1 text-end font-readexSemiBold mb-1">
                1,300+{" "}
                <Text className="font-readexRegular text-secondary">
                  participants
                </Text>
              </Text>
            </View>
          </View>
        </Container>
        <View className="mt-4">
          <Container>
            <View className="flex flex-col bg-surface w-full py-2 pb-4 px-4 rounded-lg">
              <View className="flex flex-row justify-between">
                <Text className="font-readexSemiBold">Missions</Text>
                <View className="flex flex-row space-x-2 item-center">
                  <Text className="font-readexMedium text-sm">0/4</Text>
                  <View className="my-auto">
                    <Progress.Bar
                      color={colors.primary}
                      unfilledColor={"#EDF2F7"}
                      progress={0.3}
                      width={111}
                      borderWidth={0}
                      height={12}
                      borderRadius={6}
                    />
                  </View>
                </View>
              </View>
              <View className="flex flex-col">
                <View className="mt-4">
                  <MissionTask
                    icon={<AoiCoin />}
                    content={"Complete your profile"}
                  />
                </View>
                <View className="mt-4">
                  <MissionTask
                    icon={<Telegram />}
                    content={"Connect your Telegram"}
                  />
                </View>
                <View className="mt-4">
                  <MissionTask icon={<X />} content={"Connect profile on X"} />
                </View>
                <View className="mt-4">
                  <MissionTask icon={<X />} content={"Follow AoiCrypto on X"} />
                </View>
              </View>
            </View>
          </Container>
        </View>
      </View>
    </ScrollView>
  );
};

export default MissionDetail;
