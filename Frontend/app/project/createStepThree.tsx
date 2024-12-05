import Back from "@/assets/icons/system-icons-svg/Back.svg";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import DataRow from "@/components/Items/Project/DataRow";
import Row from "@/components/Items/Project/Row";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import { colors } from "@/constants/colors";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
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

const basicData = [
  {
    tile: "Token address",
    data: "N/A",
  },
  {
    tile: "Price per token",
    data: "$0.05",
  },
  {
    tile: "Raise amount",
    data: "$200,000",
  },
];
const saleData = [
  {
    tile: "Soft Cap",
    data: "N/A",
  },
  {
    tile: "Hard Cap",
    data: "$0.05",
  },
  {
    tile: "Min Invest",
    data: "$200,000",
  },
  {
    tile: "Max Invest",
    data: "$200,000",
  },
];
const liquidData = [
  {
    tile: "Liquidity ETH to List DEX",
    data: "N/A",
  },
  {
    tile: "Liquidity Token to List DEX",
    data: "$0.05",
  },
  {
    tile: "Action for List DEX",
    data: "$200,000",
  },
  {
    tile: "Lock Expired",
    data: "$200,000",
  },
];
const saleConfigData = [
  {
    tile: "Start time",
    data: "N/A",
  },
  {
    tile: "End time",
    data: "$0.05",
  },
  {
    tile: "Sale type",
    data: "$200,000",
  },
  {
    tile: "Initial Sale Type",
    data: "$200,000",
  },
];

function createStepThree() {
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
              currentPosition={2}
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
              {basicData.map((item, index) => (
                <View className="mt-3">
                  <DataRow key={index} title={item.tile} data={item.data} />
                </View>
              ))}
            </View>
          </Container>
        </View>
        <View className="mt-2">
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
        <View className="mt-2">
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
        <View className="mt-2">
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
              <Text className="font-readexBold text-md text-primary mb-2">
                Whitelist Upload
              </Text>
              <NormalButton
                content={"Import Whiltelist from file"}
                onClick={function (): void {}}
              />
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
        <NormalButton content={"Save Project"} onClick={function (): void {}} />
      </View>
    </ScrollView>
  );
}

export default createStepThree;
