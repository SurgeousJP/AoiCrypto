import FadeInView from "@/components/Animations/FadeInView";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import SearchProject from "@/components/Items/SearchProject";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";

export default function Projects() {
  const insets = useSafeAreaInsets();
  const searchValues = [
    { label: "Show 2 results", value: 2 },
    { label: "Show 5 results", value: 5 },
    { label: "Show 10 results", value: 10 },
  ];
  return (
    <FadeInView>
      <ScrollView className="flex flex-col px-4 bg-background">
        <View className="w-full pt-4 mb-4">
          <Searchbar />
        </View>
        <View className="w-full mb-4">
          <CustomSegmentedControl screens={["All", "Etherum"]} />
        </View>

        <View className="flex flex-col mb-4">
          <View className="flex flex-row justify-end mb-2">
            <CustomDropdown placeholder="Number of results " width={'100%'} data={searchValues} />
          </View>
          <Shadow 
            stretch={true}
            offset={[0, 1]}
            startColor={"#2F66F61F"}
            distance={2}
            containerStyle={{ overflow: "visible", marginBottom: 8 }}
            style={{ borderRadius: 8 }}
          >
            <View className="flex flex-row bg-surface space-x-[18px] px-2 py-2 rounded-lg">
              <Text className="font-readexRegular text-[12px] w-[88px]">
                Project name
              </Text>
              <Text className="font-readexRegular text-[12px] w-[74px]">
                Contribution
              </Text>
              <Text className="font-readexRegular text-[12px] w-[51px] mr-5">
                Ended in
              </Text>
              <Text className="font-readexRegular text-[12px] ">ATH</Text>
            </View>
          </Shadow>
          {Array.from({ length: 8 }).map((_, index) => (
            <View key={index} className="mb-2">
              <SearchProject />
            </View>
          ))}
        </View>
      </ScrollView>
    </FadeInView>
  );
}
