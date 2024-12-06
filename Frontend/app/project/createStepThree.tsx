import Back from "@/assets/icons/system-icons-svg/Back.svg";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import DataRow from "@/components/Items/Project/DataRow";
import Row from "@/components/Items/Project/Row";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import { colors } from "@/constants/colors";
import { StateContext, StateContextType } from "@/contexts/StateProvider";
import { router, useNavigation, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const headerData = [
  {
    value: "Wallet Address",
    style: "font-readexBold text-sm",
  },
  {
    value: "Allocation",
    style: "font-readexBold text-sm",
  },
  {
    value: "Remarks",
    style: "font-readexBold text-sm",
  },
];
const rowData = [
  [
    {
      value: "EurjosAMMpk9V9ygMMxg3dpm3GQA6qXFP2cjH4wsMudf",
      style: "font-readexRegular text-sm",
    },
    {
      value: "2500 ETH",
      style: "font-readexRegular text-sm",
    },
    {
      value: "Early Bird Investor",
      style: "font-readexRegular text-sm text-error",
    },
  ],
  [
    {
      value: "EurjosAMMpk9V9ygMMxg3dpm3GQA6qXFP2cjH4wsMudf",
      style: "font-readexRegular text-sm",
    },
    {
      value: "2500 ETH",
      style: "font-readexRegular text-sm",
    },
    {
      value: "Early Bird Investor",
      style: "font-readexRegular text-sm text-error",
    },
  ],
  [
    {
      value: "EurjosAMMpk9V9ygMMxg3dpm3GQA6qXFP2cjH4wsMudf",
      style: "font-readexRegular text-sm",
    },
    {
      value: "2500 ETH",
      style: "font-readexRegular text-sm",
    },
    {
      value: "Early Bird Investor",
      style: "font-readexRegular text-sm text-error",
    },
  ],
];

function createStepThree() {

  const { createIDO, updateCreateIDO } = useContext(
    StateContext
  ) as StateContextType;

  const basicData = [
    {
      tile: "Token address",
      data: createIDO.poolDetails.tokenAddress.toString().length > 0 ? createIDO.poolDetails.tokenAddress.toString() : "Elysia N/A",
    },
    {
      tile: "Price per token",
      data: createIDO.poolDetails.pricePerToken.toString() + " ETH",
    },
  ];

  const saleData = [
    {
      tile: "Sale type",
      data: createIDO.privateSale ? "Private" : "Public",
    },
    {
      tile: "Soft Cap",
      data: createIDO.poolDetails.softCap.toString() + " ETH",
    },
    {
      tile: "Hard Cap",
      data: createIDO.poolDetails.hardCap.toString() + " ETH",
    },
    {
      tile: "Min Invest",
      data: createIDO.poolDetails.minInvest.toString() + " ETH",
    },
    {
      tile: "Max Invest",
      data: createIDO.poolDetails.maxInvest.toString() + " ETH",
    },
  ];

  const saleConfigData = [
    {
      tile: "Start time",
      data: createIDO.poolTime.startTime.toLocaleString(),
    },
    {
      tile: "End time",
      data: createIDO.poolTime.endTime.toLocaleString(),
    },
    {
      tile: "Initial sale time",
      data: createIDO.poolTime.startPublicSale,
    },
  ];

  const liquidData = [
    {
      tile: "Liquidity ETH to List DEX",
      data: createIDO.poolDetails.liquidityWETH9.toString() + " ETH",
    },
    {
      tile: "Liquidity Token to List DEX",
      data: createIDO.poolDetails.liquidityToken.toString() + " ETH",
    },
    {
      tile: "Action for List DEX",
      data: createIDO.action,
    },
    {
      tile: "Lock Expired",
      data: createIDO.lockExpired.toString(),
    },
  ];

  const onNavigatingBack = () => {
    // router.back();
    router.navigate("/project/createStepTwo");
  }
  return (
    <ScrollView className="flex-1 bg-background">
      <ScreenHeader
        LeftComponent={
          <TouchableOpacity onPress={onNavigatingBack} className="p-2">
            <Back stroke={colors.secondary} width={24} height={24} />
          </TouchableOpacity>
        }
        CenterComponent={
          <View className="w-[240px] h-[24px] mb-2">
            <StepIndicatorComponent
              mode={"horizontal"}
              labels={["", "", ""]}
              currentPosition={2}
            />
          </View>
        }
        RightComponent={<Back stroke={"#ffffff"} width={24} height={24} />}
      />

      <View className="flex flex-col p-4">
        <View className="mt-4">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Basic Information
              </Text>
              {basicData.map((item, index) => (
                <View className="mt-3">
                  <DataRow key={index} title={item.tile} data={item.data} />
                </View>
              ))}
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
              {saleData.map((item, index) => (
                <View className="mt-3">
                  <DataRow key={index} title={item.tile} data={item.data} />
                </View>
              ))}
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
              {liquidData.map((item, index) => (
                <View className="mt-3">
                  <DataRow key={index} title={item.tile} data={item.data} />
                </View>
              ))}
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
                Sale Configuration
              </Text>
              {saleConfigData.map((item, index) => (
                <View className="mt-3">
                  <DataRow key={index} title={item.tile} data={item.data} />
                </View>
              ))}
            </View>
          </Container>
        </View>
        <View className="mt-4">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary ">
                Whitelist users
              </Text>
              <FlatList
                style={{
                  paddingHorizontal: 0,
                  borderColor: colors.border,
                  borderWidth: 0.5,
                  elevation: 1,
                  marginTop: 12,
                  marginBottom: 5,
                }}
                contentContainerStyle={{ flexGrow: 1, gap: 0 }}
                data={[headerData, ...rowData]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => {
                  return (
                    <View>
                      <Row key={item.index} contents={item.item} />
                    </View>
                  );
                }}
              />
            </View>
          </Container>
        </View>
        <PrimaryButton content={"Save Project"} onPress={function (): void {}} />
      </View>
    </ScrollView>
  );
}

export default createStepThree;
