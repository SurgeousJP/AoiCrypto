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
  CreateIDOInput,
  LiquidityPoolAction,
} from "@/contracts/types/IDO/CreateIDOInput";
import { getIDOFactoryAddress } from "@/contracts/utils/getAddress.util";
import { useApproveSender } from "@/hooks/smart-contract/AoiERC20/useApproveSpender";
import { useReadAllowance } from "@/hooks/smart-contract/AoiERC20/useReadAllowance";
import { useCreateIDO } from "@/hooks/smart-contract/IDOFactory/useCreateIDO";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { handleCopyToClipboard } from "@/utils/clipboard";
import { useCreateAllowlistEntry } from "@/hooks/useApiHook";
import { UserInfor } from "@/model/ApiModel";
import { EMPTY_MERKLE_ROOT } from "@/utils/merkleTree";
// IMPORT

const getBasicDataDisplay = (createIDO: CreateIDOInput) => {
  return [
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
        Number(createIDO.poolDetails.pricePerToken) / BIGINT_CONVERSION_FACTOR +
        " ETH",
    },
  ];
};

const getSaleDataDisplay = (createIDO: CreateIDOInput) => {
  return [
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
};

const getSaleConfigDataDisplay = (createIDO: CreateIDOInput) => {
  return [
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
    ...(createIDO.privateSale &&
    createIDO.poolDetails.privateSaleAmount < createIDO.poolDetails.hardCap
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
};

const getLiquidDataDisplay = (createIDO: CreateIDOInput) => {
  return [
    {
      tile: "ETH to List DEX",
      data:
        getStringValueFromBigInt(createIDO.poolDetails.liquidityWETH9) + " ETH",
    },
    {
      tile: "Token to List DEX",
      data:
        getStringValueFromBigInt(createIDO.poolDetails.liquidityToken),
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
};

const getAddressDataDisplay = (addressList: UserInfor[]) => {
  return addressList.map((item) => {
    return [
      {
        style: "text-left font-readexRegular",
        value: item.userAddress,
      },
      {
        style: "text-left font-readexRegular",
        value: item.emailAddress,
      },
      {
        style: "text-left font-readexRegular",
        value: item.userFullName,
      },
    ];
  });
};

function createStepThree() {
  const params = useLocalSearchParams<any>();
  const addresses = JSON.parse(params.addresses);

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
  const [isWalletEnoughWETH9, setIsWalletEnoughWETH9] = useState(false);
  const [numsOfTokenRequiredForIDO, setNumsOfTokenRequiredForIDO] = useState(0);
  const [isWalletEnoughTokenForIDO, setIsWalletEnoughTokenForIDO] =
    useState(false);
  const [numsOfTokenLacked, setNumsOfTokenLacked] = useState(0);
  const [ethsAvailable, setEthsAvailable] = useState(-1);
  const [allowanceValue, setAllowanceValue] = useState<number>(-1);
  const client = useApolloClient();

  // PRINT DATA
  const basicData = getBasicDataDisplay(createIDO);

  const saleData = getSaleDataDisplay(createIDO);

  const saleConfigData = getSaleConfigDataDisplay(createIDO);

  const liquidData = getLiquidDataDisplay(createIDO);

  const whitelistHeader = [
    { value: "Address", style: "font-readexRegular text-sm text-left" },
    { value: "Email", style: "font-readexRegular text-sm text-left" },
    { value: "Full name", style: "font-readexRegular text-sm text-left" },
  ];
  const whitelistData = getAddressDataDisplay(addresses);

  // READING ALLOWANCE & WALLET BALANCE
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
        Math.floor(Number(createIDOPoolAllowance) / BIGINT_CONVERSION_FACTOR)
      );
    }
  }, [isLoadingAllowance, createIDOPoolAllowance]);

  useEffect(() => {
    if (ethsAvailable !== -1 && allowanceValue !== -1) {
      const { liquidityWETH9, hardCap, pricePerToken, liquidityToken } =
        createIDO.poolDetails;

      const walletEnoughWETH9 =
        ethsAvailable >= Number(liquidityWETH9) / BIGINT_CONVERSION_FACTOR;
      setIsWalletEnoughWETH9(walletEnoughWETH9);

      const requiredTokens = Math.ceil(
        Number(hardCap / pricePerToken) +
          Number(liquidityToken) / BIGINT_CONVERSION_FACTOR
      );

      setNumsOfTokenRequiredForIDO(requiredTokens);

      const walletEnoughTokens = allowanceValue >= requiredTokens;
      setIsWalletEnoughTokenForIDO(walletEnoughTokens);

      // Calculate the number of tokens lacking, if any
      const tokensLacked = walletEnoughTokens
        ? 0
        : requiredTokens - allowanceValue;
      setNumsOfTokenLacked(tokensLacked);
    }
  }, [ethsAvailable, allowanceValue]);

  // APPROVE HOOK & HANDLER
  const {
    error: errorApprove,
    errorWrite: errorWriteApprove,
    isLoading: isLoadingApproveSender,
    onApproveSender,
  } = useApproveSender({
    chainId,
    tokenAddress: createIDO.poolDetails.tokenAddress,
    spenderAddress: getIDOFactoryAddress(chainId),
    numOfTokensAllowed: numsOfTokenRequiredForIDO * BIGINT_CONVERSION_FACTOR,
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

      setIsWalletEnoughTokenForIDO(true);

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
    onSettled: (data?: TransactionReceipt) => {},
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

  // CREATE IDO HOOK & HANDLER
  const { config, error, errorWrite, isLoading, onCreateIDO } = useCreateIDO({
    chainId: chainId,
    idoInput: createIDO,
    enabled: isWalletEnoughTokenForIDO,
    onSuccess: (data: TransactionReceipt) => {
      if (isLoadingCreateIDOModalVisible) {
        setLoadingCreateIDOModalVisible(false);
      }

      if (createIDO.whitelisted !== EMPTY_MERKLE_ROOT) {
        handleCreateAllowlist();
      }

      showToast(
        "success",
        "Transaction success",
        "Create new IDO successfully"
      );
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
      router.navigate("/seller/project");
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

  const onNavigatingBack = () => {
    // router.back();
    router.navigate("/project/createStepTwo");
  };

  // UTILS
  const copyTokensDeficit = async () => {
    await handleCopyToClipboard(numsOfTokenRequiredForIDO.toString());
  };

  const createAllowListMutation = useCreateAllowlistEntry();

  const handleCreateAllowlist = () => {
    if (config === undefined || config.result === undefined) {
      showToast(
        "error",
        "Invalid operation",
        "The pool address is not available for whitelisting."
      );
      return;
    }
    createAllowListMutation.mutate(
      {
        poolAddress: config.result,
        userInfors: addresses,
        status: "Accepted",
      },
      {
        onSuccess: () => {},
        onError: () => {
          showToast("error", "Allowlist submit failed", "Please try again");
        },
      }
    );
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
            <Back stroke={colors.secondary} width={20} height={20} />
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

      <View className="flex flex-col">
        <View className="mt-4">
          <Container>
            <View
              className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
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
              className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
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
              className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
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
              className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
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
        {createIDO.privateSale && whitelistData.length > 0 && (
          <View className="mt-4">
            <Container>
              <View
                className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
                style={{ elevation: 2 }}
              >
                <Text className="font-readexBold text-md text-primary ">
                  Whitelist users
                </Text>
                <FlatList
                  style={{
                    borderWidth: 0.5,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 0,
                    elevation: 1,
                    marginTop: 12,
                    marginBottom: 5,
                  }}
                  contentContainerStyle={{ flexGrow: 1, gap: 0 }}
                  scrollEnabled={false}
                  data={[whitelistHeader, ...whitelistData]}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) => {
                    return (
                      <View
                        key={Math.random()}
                        className={`flex flex-row  ${
                          item.index % 2 === 1 ? "bg-gray-50" : "bg-surface"
                        }`}
                      >
                        {item.item.map((content, index) => {
                          return (
                            <View
                              className={`flex-1 px-4 py-3 ${content.style}`}
                            >
                              <Text className={`text-center ${content.style} `}>
                                {content.value}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  }}
                />
              </View>
            </Container>
          </View>
        )}
        {isWalletEnoughTokenForIDO ? (
          <View className="m-4">
            <PrimaryButton
              disabled={isLoading}
              content={"Save Project"}
              onPress={onSaveProject}
            />
          </View>
        ) : (
          <View className="">
            <View className="mt-4 mb-4">
              <Container>
                <View
                  className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
                  style={{ elevation: 2 }}
                >
                  <Pressable className="flex flex-col">
                    <View className="flex flex-row justify-between">
                      <Text className="font-readexRegular text-sm text-secondary">
                        Allowance tokens:{" "}
                      </Text>
                      <Text className="font-readexSemiBold text-sm">
                        {allowanceValue}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between">
                      <Text className="font-readexRegular text-sm text-secondary">
                        Required tokens:{" "}
                      </Text>
                      <Text className="font-readexSemiBold text-sm">
                        {numsOfTokenRequiredForIDO}
                      </Text>
                    </View>

                    {/* {numsOfTokenLacked > 0 && (
                      <View className="flex flex-row justify-between">
                        <Text className="font-readexRegular text-sm text-secondary">
                          Lacked tokens:
                        </Text>
                        <Text className="font-readexSemiBold text-error text-sm">
                          {numsOfTokenLacked}{" "}
                          <TouchableOpacity onPress={copyTokensDeficit}>
                            <Ionicons
                              name="copy-outline"
                              size={14}
                              color={colors.secondary}
                            />
                          </TouchableOpacity>
                        </Text>
                      </View>
                    )} */}
                  </Pressable>
                </View>
              </Container>
            </View>
            <View className="mx-2 mb-4">
              <PrimaryButton
                content={"Approve missing tokens"}
                disabled={isLoadingApproveSender}
                onPress={onApproveTokenTriggered}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default createStepThree;
