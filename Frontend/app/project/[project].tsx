import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import ProgressBar from "@/components/Navigations/ProgressBar/ProgressBar";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import { colors } from "@/constants/Colors";
import { useRouter, useNavigation } from "expo-router";
import React from "react";
import { View, Text, ScrollView, ImageBackground, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProjectDetail = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-4 py-4">
        <Container>
          <View className="bg-surface rounded-lg overflow-scroll px-4 py-2 pt-0">
            <View className="w-full flex flex-col mb-2 ">
              <ImageBackground
                source={projectIllust}
                className="w-full h-[183px]"
              />
            </View>
            <View className="flex flex-row space-x-2">
              <Image source={projectLogo} className="w-8 h-8" />
              <View className="flex flex-col">
                <Text className="text-md font-readexBold mb-1">Highstreet</Text>
                <Text className="text-sm text-secondary font-readexLight mb-1">
                  Shopify on an MMORPG
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <View className="pt-4 flex flex-col">
          <CustomSegmentedControl
            screens={["Overview", "Description", "Token & Pool"]}
            components={[<Overview />, <Description />, <TokenNPool />]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProjectDetail;
