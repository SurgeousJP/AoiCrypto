import Back from "@/assets/icons/system-icons-svg/Back.svg";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import DataRow from "@/components/Items/Project/DataRow";
import Row from "@/components/Items/Project/Row";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import { colors } from "@/constants/colors";
import {
  getDateFromUnixTimestamp,
  getStringValueFromBigInt,
} from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { StateContext, StateContextType } from "@/contexts/StateProvider";
import {
  LiquidityPoolAction,
  sampleCreateIDOInput,
} from "@/contracts/types/IDO/CreateIDOInput";
import { useCreateIDO } from "@/hooks/smart-contract/IDOFactory/useCreateIDO";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TransactionReceipt } from "viem";

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
  const { createIDO, resetCreateIDO } = useContext(
    StateContext
  ) as StateContextType;
  const { chainId } = useContext(AuthContext);
  const [isLoadingModalVisible, setLoadingModalVisible] = useState(false);
  const client = useApolloClient();

  const basicData = [
    {
      tile: "Token address",
      data:
        createIDO.poolDetails.tokenAddress.toString().length > 0
          ? createIDO.poolDetails.tokenAddress.toString()
          : "Elysia N/A",
    },
    {
      tile: "Price per token",
      data:
        getStringValueFromBigInt(createIDO.poolDetails.pricePerToken) + " ETH",
    },
  ];

  const saleData = [
    {
      tile: "Sale type",
      data: createIDO.privateSale ? "Private" : "Public",
    },
    {
      tile: "Soft Cap",
      data: getStringValueFromBigInt(createIDO.poolDetails.softCap) + " ETH",
    },
    {
      tile: "Hard Cap",
      data: getStringValueFromBigInt(createIDO.poolDetails.hardCap) + " ETH",
    },
    {
      tile: "Min Invest",
      data: getStringValueFromBigInt(createIDO.poolDetails.minInvest) + " ETH",
    },
    {
      tile: "Max Invest",
      data: getStringValueFromBigInt(createIDO.poolDetails.maxInvest) + " ETH",
    },
  ];

  const saleConfigData = [
    {
      tile: "Start time",
      data: getDateFromUnixTimestamp(
        createIDO.poolTime.startTime
      ).toLocaleString(),
    },
    {
      tile: "End time",
      data: getDateFromUnixTimestamp(
        createIDO.poolTime.endTime
      ).toLocaleString(),
    },
    ...(createIDO.privateSale
      ? [
          {
            tile: "Initial sale time",
            data: getDateFromUnixTimestamp(
              createIDO.poolTime.startPublicSale
            ).toLocaleString(),
          },
        ]
      : []),
  ];

  const liquidData = [
    {
      tile: "ETH to List DEX",
      data:
        getStringValueFromBigInt(createIDO.poolDetails.liquidityWETH9) + " ETH",
    },
    {
      tile: "Token to List DEX",
      data:
        getStringValueFromBigInt(createIDO.poolDetails.liquidityToken) + " ETH",
    },
    {
      tile: "Action for List DEX",
      data: LiquidityPoolAction[createIDO.action].toString(),
    },
    ...(createIDO.action === LiquidityPoolAction.LOCK
      ? [
          {
            tile: "Lock Expired",
            data: getDateFromUnixTimestamp(
              createIDO.lockExpired
            ).toLocaleString(),
          },
        ]
      : []),
  ];

  console.log(createIDO);

  const { error, errorWrite, isLoading, onCreateIDO } = useCreateIDO({
    chainId: chainId,
    idoInput: createIDO,
    enabled: true,
    onSuccess: (data: TransactionReceipt) => {
      if (isLoadingModalVisible) {
        setLoadingModalVisible(false);
      }

      showToast(
        "success",
        "Transaction success",
        "Create new token successfully"
      );

      // clearCache(client, "GetTokens");
    },
    onError: (error?: Error) => {
      if (isLoadingModalVisible) {
        setLoadingModalVisible(false);
      }

      showToast(
        "error",
        "Transaction failed",
        error != undefined ? error.message : "No error"
      );
    },
    onSettled: (data?: TransactionReceipt) => {
      client.resetStore();
      resetCreateIDO();
      router.navigate("/seller");
    },
  });

  const onSaveProject = async () => {
    setLoadingModalVisible(false);
    await onCreateIDO();
  }

  useEffect(() => {
    if (isLoadingModalVisible && errorWrite) {
      setLoadingModalVisible(false);
      showToast(
        "error",
        "Error writing transaction: ",
        error?.message ?? "N/A"
      );
    }
  }, [errorWrite]);

  const onNavigatingBack = () => {
    // router.back();
    router.navigate("/project/createStepTwo");
  };
  return (
    <ScrollView className="flex-1 bg-background">
      <LoadingModal
        isVisible={isLoadingModalVisible}
        task={"Creating new IDO pool. . ."}
      />
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
              {basicData.map((item, index) => {
                if (index > 0)
                  return (
                    <View className="mt-3">
                      <DataRow key={index} title={item.tile} data={item.data} />
                    </View>
                  );
                return (
                  <View>
                    <Text className="text-md font-readexRegular text-secondary">
                      {item.tile}
                    </Text>
                    <Text className="text-md font-readexSemiBold text-black">
                      {item.data}
                    </Text>
                  </View>
                );
              })}
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
        {createIDO.privateSale && (
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
        )}
        <View className="mt-4">
          <PrimaryButton
            disabled={isLoading}
            content={"Save Project"}
            onPress={onSaveProject}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default createStepThree;
