import Back from "@/assets/icons/system-icons-svg/Back.svg";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import { colors } from "@/constants/Colors";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const CreateStepOne = () => {
  const navigation = useNavigation();
  const router = useRouter();

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
                <Input label={"Token address"} type="text" />
              </View>
              <View className="mb-3">
                <Input label={"Price per token"} type="numeric" />
              </View>
              <View className="mb-3">
                <Input label={"Raised amount"} type="numeric" />
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
                  <Input label={"Soft cap"} type="numeric" />
                </View>
                <View className="basis-[48%]">
                  <Input label={"Hard cap"} type="numeric" />
                </View>
              </View>

              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input label={"Min invest"} type="numeric" />
                </View>
                <View className="basis-[48%]">
                  <Input label={"Max invest"} type="numeric" />
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
                <Input label={"Liquidity ETH to List DEX"} type="numeric" />
              </View>
              <View className="mb-3">
                <Input label={"Liquidity Token to List DEX"} type="numeric" />
              </View>
              <View className="mb-3">
                <Input label={"Lock Expired"} type="numeric" />
              </View>
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <NormalButton
            content={"Go to next step"}
            onClick={() => router.push("/project/createStepTwo")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateStepOne;
