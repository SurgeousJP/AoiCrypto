import ScreenHeader from "@/components/Layouts/ScreenHeader";
import { colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import Container from "@/components/Layouts/Container";
import Input from "@/components/Inputs/Input/Input";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";

const CreateStepOne = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <ScreenHeader
        LeftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Back stroke={colors.secondary} width={24} height={24} />
          </TouchableOpacity>
        }
        CenterComponent={
          <View className="w-[240px] h-[24px] mb-2">
            <StepIndicatorComponent
              mode={"horizontal"}
              labels={["", "", ""]}
              currentPosition={0}
            />
          </View>
        }
        RightComponent={<Back stroke={"#ffffff"} width={24} height={24} />}
      />

      <View className="flex flex-col p-4">
        <View className="mt-2">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Basic Information
              </Text>
              <View className="mb-3">
                <Input label={"Token address"} />
              </View>
              <View className="mb-3">
                <Input label={"Price per token"} />
              </View>
              <View className="mb-3">
                <Input label={"Raised amount"} />
              </View>
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Sale Details
              </Text>
              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input label={"Soft cap"} />
                </View>
                <View className="basis-[48%]">
                  <Input label={"Hard cap"} />
                </View>
              </View>

              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input label={"Min invest"} />
                </View>
                <View className="basis-[48%]">
                  <Input label={"Max invest"} />
                </View>
              </View>
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Liquidity for DEX Listing
              </Text>
              <View className="mb-3">
                <Input label={"Liquidity ETH to List DEX"} />
              </View>
              <View className="mb-3">
                <Input label={"Liquidity Token to List DEX"} />
              </View>
              <View className="mb-3">
                <Input label={"Lock Expired"} />
              </View>
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <NormalButton
            content={"Go to next step"}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateStepOne;
