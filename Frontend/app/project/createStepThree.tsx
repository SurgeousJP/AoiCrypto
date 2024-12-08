// IMPORT
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
  BIGINT_CONVERSION_FACTOR,
  getDateFromUnixTimestamp,
  getStringValueFromBigInt,
} from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { StateContext, StateContextType } from "@/contexts/StateProvider";
import {
  LiquidityPoolAction,
  sampleCreateIDOInput,
} from "@/contracts/types/IDO/CreateIDOInput";
import { getIDOFactoryAddress } from "@/contracts/utils/getAddress.util";
import { useApproveSender } from "@/hooks/smart-contract/AoiERC20/useApproveSpender";
import { useReadAllowance } from "@/hooks/smart-contract/AoiERC20/useReadAllowance";
import { useCreateIDO } from "@/hooks/smart-contract/IDOFactory/useCreateIDO";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TransactionReceipt } from "viem";
import { useBalance } from "wagmi";
import * as Clipboard from "expo-clipboard";
// IMPORT

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
  const { address, chainId } = useContext(AuthContext);
  const [isLoadingCreateIDOModalVisible, setLoadingCreateIDOModalVisible] =
    useState(false);
  const [
    isLoadingApproveTokenModalVisible,
    setLoadingApproveTokenModalVisible,
  ] = useState(false);
  const client = useApolloClient();

  // PRINT DATA
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
  // PRINT DATA

  // READ ALLOWANCE HOOK
  const {
    isLoading: isLoadingAllowance,
    isError: isErrorAllowance,
    isSuccess: isSuccessAllowance,
    allowance: createIDOPoolAllowance,
  } = useReadAllowance({
    chainId,
    ownerAddress: address,
    tokenAddress: createIDO.poolDetails.tokenAddress,
    spenderAddress: getIDOFactoryAddress(chainId),
    enabled: true,
  });

  const ethBalance = useBalance({
    address: address,
  });

  // VALIDATE IDO CONSTRAINT
  const [isWalletEnoughWETH9, setIsWalletEnoughWETH9] = useState(false);
  const [numsOfTokenRequiredForIDO, setNumsOfTokenRequiredForIDO] = useState(0);
  const [isWalletEnoughTokenForIDO, setIsWalletEnoughTokenForIDO] =
    useState(false);
  const [numsOfTokenLacked, setNumsOfTokenLacked] = useState(0);
  const [ethsAvailable, setEthsAvailable] = useState(-1);
  const [allowanceValue, setAllowanceValue] = useState<number>(-1);

  useEffect(() => {
    if (ethBalance !== undefined && ethBalance.data !== undefined) {
      setEthsAvailable(
        Number(ethBalance?.data?.value) / BIGINT_CONVERSION_FACTOR
      );
    }
  }, [ethBalance]);

  useEffect(() => {
    if (createIDOPoolAllowance !== undefined) {
      setAllowanceValue(
        Number(createIDOPoolAllowance) / BIGINT_CONVERSION_FACTOR
      );
    }
  }, [isLoadingAllowance, createIDOPoolAllowance]);

  useEffect(() => {
    if (ethsAvailable !== -1 && allowanceValue !== -1) {
      const { liquidityWETH9, hardCap, pricePerToken, liquidityToken } =
        createIDO.poolDetails;

      const walletEnoughWETH9 = ethsAvailable >= Number(liquidityWETH9) / BIGINT_CONVERSION_FACTOR;
      setIsWalletEnoughWETH9(walletEnoughWETH9);

      const requiredTokens =
        Number(hardCap / pricePerToken) +
        Number(liquidityToken) / BIGINT_CONVERSION_FACTOR;

      setNumsOfTokenRequiredForIDO(requiredTokens);

      const walletEnoughTokens = allowanceValue > requiredTokens;
      setIsWalletEnoughTokenForIDO(walletEnoughTokens);

      // Calculate the number of tokens lacking, if any
      const tokensLacked = walletEnoughTokens
        ? 0
        : requiredTokens - allowanceValue;
      if (tokensLacked === 0){
        setIsWalletEnoughTokenForIDO(true);
      }
      setNumsOfTokenLacked(tokensLacked);
    }
  }, [ethsAvailable, allowanceValue]);

  const {
    error: errorApprove,
    errorWrite: errorWriteApprove,
    isLoading: isLoadingApproveSender,
    onApproveSender,
  } = useApproveSender({
    chainId,
    tokenAddress: createIDO.poolDetails.tokenAddress,
    spenderAddress: getIDOFactoryAddress(chainId),
    numOfTokensAllowed: numsOfTokenLacked,
    enabled: !isWalletEnoughTokenForIDO,
    onSuccess: (data: TransactionReceipt) => {
      if (isLoadingCreateIDOModalVisible) {
        setLoadingCreateIDOModalVisible(false);
      }

      showToast(
        "success",
        "Approve success",
        "The lacking tokens has been approved"
      );

      // clearCache(client, "GetTokens");
    },
    onError: (error?: Error) => {
      if (isLoadingCreateIDOModalVisible) {
        setLoadingCreateIDOModalVisible(false);
      }

      showToast(
        "error",
        "Transaction failed",
        error != undefined ? error.message : "No error"
      );
    },
    onSettled: (data?: TransactionReceipt) => {
    },
  });

  useEffect(() => {
    if (isLoadingApproveTokenModalVisible && errorWriteApprove) {
      setLoadingApproveTokenModalVisible(false);
      showToast(
        "error",
        "Error writing transaction: ",
        errorApprove?.message ?? "N/A"
      );
    }
  }, [errorWriteApprove]);

  const onApproveTokenTriggered = async () => {
    setLoadingApproveTokenModalVisible(false);
    await onApproveSender();
  };

  const onSaveProject = async () => {
    if (!isWalletEnoughWETH9) {
      showToast(
        "error",
        "Insufficient balance",
        "Your wallet has insufficient ETH for WETH9"
      );
      return;
    }
    setLoadingCreateIDOModalVisible(false);
    await onCreateIDO();
  };
  // VALIDATE IDO CONSTRAINT

  // CREATE IDO HOOK & HANDLING
  const { error, errorWrite, isLoading, onCreateIDO } = useCreateIDO({
    chainId: chainId,
    idoInput: createIDO,
    enabled: isWalletEnoughTokenForIDO,
    onSuccess: (data: TransactionReceipt) => {
      if (isLoadingCreateIDOModalVisible) {
        setLoadingCreateIDOModalVisible(false);
      }

      showToast(
        "success",
        "Transaction success",
        "Create new token successfully"
      );

      // clearCache(client, "GetTokens");
    },
    onError: (error?: Error) => {
      if (isLoadingCreateIDOModalVisible) {
        setLoadingCreateIDOModalVisible(false);
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

  useEffect(() => {
    if (isLoadingCreateIDOModalVisible && errorWrite) {
      setLoadingCreateIDOModalVisible(false);
      showToast(
        "error",
        "Error writing transaction: ",
        error?.message ?? "N/A"
      );
    }
  }, [errorWrite]);
  // CREATE IDO HOOK & HANDLING

  const onNavigatingBack = () => {
    // router.back();
    router.navigate("/project/createStepTwo");
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(numsOfTokenLacked.toString());
    const clipboard = await Clipboard.getStringAsync();
    showToast("info", "Copied to clipboard", clipboard);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <LoadingModal
        isVisible={isLoadingApproveTokenModalVisible}
        task={"Approving tokens. . ."}
      />
      <LoadingModal
        isVisible={isLoadingCreateIDOModalVisible}
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
        {isWalletEnoughTokenForIDO ? (
          <View className="mt-4">
            <PrimaryButton
              disabled={isLoading}
              content={"Save Project"}
              onPress={onSaveProject}
            />
          </View>
        ) : (
          <View className="mt-4">
            <Pressable className="flex flex-rowitems-center h-fit mb-4">
              {numsOfTokenLacked > 0 && (
                <Text className="font-readexSemiBold text-md">
                  {`Number of tokens lacked: ${numsOfTokenLacked}`}{" "}
                  <TouchableOpacity onPress={handleCopyToClipboard}>
                    <Ionicons
                      name="copy-outline"
                      size={10}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </Text>
              )}
            </Pressable>
            <PrimaryButton
              content={"Approve missing tokens"}
              disabled={isLoadingApproveSender}
              onPress={onApproveTokenTriggered}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default createStepThree;
