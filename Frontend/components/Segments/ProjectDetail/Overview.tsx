import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/Colors";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import * as Progress from "react-native-progress";

const Overview = () => {
  const projectOverview = [
    { label: "Status", data: "Sale live" },
    { label: "Sale Type", data: "Whitelist Only" },
    { label: "Max Buy", data: "0.2 ETH" },
    { label: "Current Rate", data: "1 ETH = 282,726.4236 High" },
    { label: "Current Raised", data: "48.82 ETH (97.64%)" },
    { label: "Total Contributors", data: "245" },
  ];
  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");
  return (
    <View className="w-full flex flex-col">
      <View className="mt-2 flex flex-col w-full">
        <View className="mb-2">
          <Container>
            <View className="bg-surface rounded-lg overflow-scroll px-4 py-2 pt-0">
              <View className="w-full flex flex-col mb-2">
                <ImageBackground
                  source={projectIllust}
                  className="w-full h-[183px]"
                />
              </View>
              <View className="flex flex-row space-x-2">
                <Image source={projectLogo} className="w-8 h-8" />
                <View className="flex flex-col">
                  <Text className="text-md font-readexBold mb-1">
                    Highstreet
                  </Text>
                  <Text className="text-sm text-secondary font-readexLight mb-1">
                    Shopify on an MMORPG
                  </Text>
                </View>
              </View>
            </View>
          </Container>
        </View>
        <Container>
          <View className="bg-surface rounded-lg p-4 flex flex-col h-fit">
            <Progress.Bar
              color={colors.primary}
              unfilledColor={"#EDF2F7"}
              progress={0.3}
              width={null}
              borderWidth={0}
              height={12}
              borderRadius={6}
            />
            <View className="flex flex-row justify-between mt-2">
              <Text className="font-readexRegular">48.82 ETH ($29.3K)</Text>
              <Text className="font-readexRegular">50 ETH ($30K)</Text>
            </View>

            <View className="flex flex-col mt-2">
              <Input label={"Amount"} />
              <View className="mt-4">
                <NormalButton content={"Import HIGH to wallet"} />
              </View>
            </View>
          </View>
        </Container>
      </View>
      <View className="mt-2 flex-1">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            {projectOverview.map((p) => {
              return (
                <View
                  key={p.label}
                  className="flex flex-row justify-between mt-2"
                >
                  <Text className="font-readexRegular">{p.label}</Text>
                  <Text className="font-readexRegular">{p.data}</Text>
                </View>
              );
            })}
          </View>
        </Container>
      </View>
    </View>
  );
};

export default Overview;
