// IMPORT
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Input from "@/components/Inputs/Input/Input";
import DataRow from "@/components/Items/Project/DataRow";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getDateFromUnixTimestamp,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { RESET_VALUE_DROPDOWN } from "@/constants/display";
import { AuthContext } from "@/contexts/AuthProvider";
import { StateContext, StateContextType } from "@/contexts/StateProvider";
import {
  LiquidityPoolAction,
  PoolDetails,
} from "@/contracts/types/IDO/CreateIDOInput";
import getABI from "@/contracts/utils/getAbi.util";
import { GET_TOKENS } from "@/queries/token";
import { EMPTY_MERKLE_ROOT } from "@/utils/merkleTree";
import { showToast } from "@/utils/toast";
import { useQuery } from "@apollo/client";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useReadContracts } from "wagmi";
// IMPORT

const CreateStepOne = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { address } = useContext(AuthContext);

  const { data: tokenQueryData } = useQuery(GET_TOKENS, {
    variables: { address: address },
    skip: !address,
  });

  const tokens = [
    ...(tokenQueryData?.tokens.map((token) => ({
      label: token.name,
      value: token.address,
    })) || []),
    RESET_VALUE_DROPDOWN,
  ];

  const actions = Object.entries(LiquidityPoolAction)
    .filter(([key, value]) => !isNaN(Number(value)))
    .map(([key, value]) => ({ label: key, value }));

  const { createIDO, updateCreateIDO } = useContext(
    StateContext
  ) as StateContextType;

  const [poolDetails, setPoolDetail] = useState<PoolDetails>({
    ...createIDO.poolDetails,
  });
  const [action, setAction] = useState<LiquidityPoolAction>(createIDO.action);
  const [lockExpired, setLockExpired] = useState(createIDO.lockExpired);
  const [isPrivateSale, setPrivateSale] = useState(false);

  const onNavigateToStepTwo = () => {
    if (isStepOneInputValid()) {
      router.push("/project/createStepTwo");
    }
    // router.push("/project/createStepTwo");
  };

  const isStepOneInputValid = () => {
    if (poolDetails.tokenAddress === "" || poolDetails.tokenAddress === null) {
      showInvalidInputToast("The token address has not been chosen");
      return false;
    }

    if (name === undefined || symbol === undefined) {
      showInvalidInputToast("The token address is not valid");
      return false;
    }

    if (poolDetails.pricePerToken <= 0n) {
      showInvalidInputToast("Price per token must be positive");
      return false;
    }

    if (poolDetails.softCap <= 0n) {
      showInvalidInputToast("Soft cap must be positive");
      return false;
    }

    if (poolDetails.hardCap <= 0n) {
      showInvalidInputToast("Hard cap must be positive");
      return false;
    }

    if (poolDetails.minInvest <= 0n) {
      showInvalidInputToast("Min invest must be positive");
      return false;
    }

    if (poolDetails.maxInvest <= 0n) {
      showInvalidInputToast("Max invest must be positive");
      return false;
    }

    const minWETH9 = BigInt(0.01 * BIGINT_CONVERSION_FACTOR);

    if (poolDetails.liquidityWETH9 < minWETH9) {
      showInvalidInputToast(
        "Liquidity ETH to List DEX must be at least 0.01 ETH"
      );
      return false;
    }

    if (poolDetails.liquidityToken <= 0n) {
      showInvalidInputToast("Liquidity token must be positive");
      return false;
    }

    if (poolDetails.softCap >= poolDetails.hardCap) {
      showInvalidInputToast("Soft cap must be less than hard cap");
      return false;
    }

    if (poolDetails.minInvest >= poolDetails.maxInvest) {
      showInvalidInputToast("Min invest must be less than Max invest");
      return false;
    }

    if (isPrivateSale && poolDetails.privateSaleAmount <= 0n){
      showInvalidInputToast("Private sale amount must be positive");
      return false;
    }

    if (isPrivateSale && poolDetails.privateSaleAmount > poolDetails.hardCap){
      showInvalidInputToast("Private sale amount must not exceed the hard cap");
      return false;
    }

    if (action === LiquidityPoolAction.LOCK && lockExpired <= 0n) {
      showInvalidInputToast("Lock expired value is not valid");
      return false;
    }

    return true;
  };

  const showInvalidInputToast = (message: string) => {
    showToast("error", "Invalid Input", message);
  };

  useEffect(() => {
    updateCreateIDO("poolDetails", poolDetails);
  }, [poolDetails]);

  useEffect(() => {
    updateCreateIDO("lockExpired", lockExpired);
  }, [lockExpired]);

  useEffect(() => {
    updateCreateIDO("action", action);
  }, [action]);

  const onNumericChange = (name: string, value: any) => {
    setPoolDetail({ ...poolDetails, [name]: BigInt(value * BIGINT_CONVERSION_FACTOR) });
  };

  const onLiquidityActionChange = (value: any) => {
    setAction(value);
  };

  const onLockExpiredChange = (name: string, value: any) => {
    if (action === LiquidityPoolAction.LOCK)
      setLockExpired(BigInt(getUnixTimestampFromDate(new Date(value))));
  };

  const onPrivateSaleChange = (checked: boolean) => {
    setPrivateSale(checked);
    updateCreateIDO("privateSale", checked);
    if (checked === false) {
      setPoolDetail({
        ...poolDetails,
        ["privateSaleAmount"]: BigInt(0 * BIGINT_CONVERSION_FACTOR),
      });
      let poolTime = createIDO.poolTime;
      poolTime.startPublicSale = BigInt(0);
      updateCreateIDO("poolTime", poolTime);
      updateCreateIDO("whitelisted", EMPTY_MERKLE_ROOT);
    }
  };

  const [tokenContract, setTokenContract] = useState({
    address: poolDetails.tokenAddress,
    abi: getABI("AoiERC20"),
  });

  const { data: token } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: "name",
      },
      {
        ...tokenContract,
        functionName: "symbol",
      },
    ],
  });

  const [name, symbol] = token?.map((token) => token.result) || ["Loading..."];

  const onTokenAddressChange = (name: any, value: any) => {
    setPoolDetail({ ...poolDetails, ["tokenAddress"]: value });
    setTokenContract({ ...tokenContract, ["address"]: value });
  };

  // console.log("Pricp per token: ", createIDO.poolDetails.privateSaleAmount);
  // console.log(typeof(createIDO.poolDetails.privateSaleAmount));
  // console.log("Hard cap: ", createIDO.poolDetails.hardCap);
  // console.log("Price per token: ", createIDO.poolDetails.pricePerToken);

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

      <View className="flex flex-col mt-1">
        <View className="mt-2">
          <Container>
            <View
              className="bg-surface  px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Basic Information
              </Text>
              <View className="mb-3">
                <Input
                  label={"Token address"}
                  name={"Token address"}
                  value={poolDetails.tokenAddress}
                  type="text"
                  onChange={onTokenAddressChange}
                  initialValue={poolDetails.tokenAddress}
                />
              </View>
              <View className="flex flex-col w-full mb-3">
                <Text className="text-sm font-readexSemiBold">
                  Token name & symbol:
                </Text>
                <Text
                  className={`text-sm font-readexRegular ${
                    name !== undefined && symbol !== undefined
                      ? "text-success"
                      : "text-error"
                  } `}
                >
                  {name !== undefined && symbol !== undefined
                    ? name + " " + "(" + symbol + ")"
                    : "Wrong token input"}
                </Text>
              </View>
              <View className="mb-3">
                <Input
                  label={"Price per token"}
                  name={"pricePerToken"}
                  value={poolDetails.pricePerToken}
                  type="numeric"
                  onChange={onNumericChange}
                  isUnitVisible={true}
                  initialValue={poolDetails.pricePerToken}
                />
              </View>
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
              <View className="w-full mb-3">
                <Checkbox
                  keyValue={"isPrivateSale"}
                  content={"Private sale enabled"}
                  onChange={onPrivateSaleChange}
                  initialValue={createIDO.privateSale}
                ></Checkbox>
              </View>
              {isPrivateSale && (
                <View className="mb-3">
                  <Input
                    label={"Private sale amount"}
                    type="numeric"
                    name="privateSaleAmount"
                    value={poolDetails.privateSaleAmount}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                    initialValue={createIDO.poolDetails.privateSaleAmount}
                  />
                </View>
              )}
              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input
                    label={"Soft cap"}
                    type="numeric"
                    name={"softCap"}
                    value={poolDetails.softCap}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                    initialValue={createIDO.poolDetails.softCap}
                  />
                </View>
                <View className="basis-[48%]">
                  <Input
                    label={"Hard cap"}
                    type="numeric"
                    name={"hardCap"}
                    value={poolDetails.hardCap}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                    initialValue={createIDO.poolDetails.hardCap}
                  />
                </View>
              </View>

              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input
                    label={"Min invest"}
                    type="numeric"
                    name={"minInvest"}
                    value={poolDetails.minInvest}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                    initialValue={createIDO.poolDetails.minInvest}
                  />
                </View>
                <View className="basis-[48%]">
                  <Input
                    label={"Max invest"}
                    type="numeric"
                    name="maxInvest"
                    value={poolDetails.maxInvest}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                    initialValue={createIDO.poolDetails.maxInvest}
                  />
                </View>
              </View>
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
              <View className="mb-3">
                <Input
                  label={"ETH to List DEX"}
                  type="numeric"
                  name="liquidityWETH9"
                  value={poolDetails.liquidityWETH9}
                  onChange={onNumericChange}
                  isUnitVisible={true}
                  initialValue={createIDO.poolDetails.liquidityWETH9}
                />
              </View>
              <View className="mb-3">
                <Input
                  label={"Tokens to List DEX"}
                  type="numeric"
                  value={poolDetails.liquidityToken}
                  name="liquidityToken"
                  onChange={onNumericChange}
                  isUnitVisible={false}
                  initialValue={createIDO.poolDetails.liquidityToken}
                />
              </View>
              <View className="mb-3">
                <Text className="font-readexSemiBold">
                  Action for Listing DEX
                </Text>
                {actions && (
                  <CustomDropdown
                    placeholder="Select token"
                    data={actions}
                    value={action}
                    onChange={onLiquidityActionChange}
                  />
                )}
              </View>
              {action === LiquidityPoolAction.LOCK && (
                <View className="mb-3">
                  <Input
                    label={"Lock Expired"}
                    type="datetime"
                    value={getDateFromUnixTimestamp(lockExpired)}
                    name="lockExpired"
                    onChange={onLockExpiredChange}
                    initialValue={getDateFromUnixTimestamp(lockExpired)}
                  />
                </View>
              )}
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <PrimaryButton
            content={"Go to next step"}
            onPress={onNavigateToStepTwo}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateStepOne;
