import React from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import * as Progress from "react-native-progress";
import Container from "@/components/Layouts/Container";
import Description from "@/components/Segments/ProjectDetail/Description";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import { colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";

const PrivateSaleSegment = () => {
  const router = useRouter();
  const navigateToWhitelistApplication = () => {
    router.navigate("/project/whitelistForm");
  }

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

        <Description />

        <View className="mt-4">
          <Container>
            <View className="bg-surface rounded-lg p-4 flex flex-col h-fit">
              <Text className="font-readexRegular">
                The allowlist for Highstreet is now available, and you can apply
                for it below
              </Text>
              <View className="mt-4">
                <NormalButton content={"Apply now"} onClick={navigateToWhitelistApplication}/>
              </View>
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default PrivateSaleSegment;
