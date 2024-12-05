// IMPORT
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Input from "@/components/Inputs/Input/Input";
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
import {
  createDefaultCreateIDOInput,
  CreateIDOInput,
  LiquidityPoolAction,
  PoolDetails,
} from "@/contracts/types/IDO/CreateIDOInput";
import { GET_TOKENS } from "@/queries/token";
import { useQuery } from "@apollo/client";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const createIDO = useRef<CreateIDOInput>(createDefaultCreateIDOInput());

  const [poolDetail, setPoolDetail] = useState<PoolDetails>({
    tokenAddress: "",
    pricePerToken: 0n,
    raisedAmount: 0n,
    raisedTokenAmount: 0n,
    softCap: 0n,
    hardCap: 0n,
    minInvest: 0n,
    maxInvest: 0n,
    liquidityWETH9: 0n,
    liquidityToken: 0n,
    privateSaleAmount: 0n,
  });
  const [action, setAction] = useState<LiquidityPoolAction>(
    LiquidityPoolAction.NOTHING
  );
  const [lockExpired, setLockExpired] = useState(0n);

  useEffect(() => {
    createIDO.current.poolDetails = poolDetail;
  }, [poolDetail]);

  useEffect(() => {
    createIDO.current.lockExpired = lockExpired;
  }, [lockExpired]);

  useEffect(() => {
    createIDO.current.action = action;
  }, [action]);

  useEffect(() => {
    console.log("Create IDO object: ", createIDO.current);
  }, [poolDetail, action, lockExpired]);

  const onNumericChange = (name: string, value: any) => {
    setPoolDetail({ ...poolDetail, [name]: value * BIGINT_CONVERSION_FACTOR });
  };

  const onTokenAddressChange = (value: any) => {
    setPoolDetail({ ...poolDetail, ["tokenAddress"]: value });
  };

  const onLiquidityActionChange = (value: any) => {
    setAction(value);
  };

  const onLockExpiredChange = (name: string, value: any) => {
    if (action === LiquidityPoolAction.LOCK)
      setLockExpired(BigInt(getUnixTimestampFromDate(new Date(2024, 4 - 1, 12))));
  };

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
                <Text className="font-readexSemiBold">Select token</Text>
                {tokens && (
                  <CustomDropdown
                    placeholder="Select token"
                    data={tokens}
                    value={poolDetail.tokenAddress}
                    onChange={onTokenAddressChange}
                  />
                )}
              </View>
              <View className="mb-3">
                <Input
                  label={"Price per token"}
                  name={"pricePerToken"}
                  value={poolDetail.pricePerToken}
                  type="numeric"
                  onChange={onNumericChange}
                  isUnitVisible={true}
                />
              </View>
              <View className="mb-3">
                <Input
                  type="numeric"
                  label={"Raised amount"}
                  name={"raisedAmount"}
                  value={poolDetail.raisedAmount}
                  onChange={onNumericChange}
                />
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
                  <Input
                    label={"Soft cap"}
                    type="numeric"
                    name={"softCap"}
                    value={poolDetail.softCap}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                  />
                </View>
                <View className="basis-[48%]">
                  <Input
                    label={"Hard cap"}
                    type="numeric"
                    name={"hardCap"}
                    value={poolDetail.hardCap}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                  />
                </View>
              </View>

              <View className="flex flex-row justify-between mb-3">
                <View className="basis-[48%]">
                  <Input
                    label={"Min invest"}
                    type="numeric"
                    name={"minInvest"}
                    value={poolDetail.minInvest}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                  />
                </View>
                <View className="basis-[48%]">
                  <Input
                    label={"Max invest"}
                    type="numeric"
                    name="maxInvest"
                    value={poolDetail.maxInvest}
                    onChange={onNumericChange}
                    isUnitVisible={true}
                  />
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
                <Input
                  label={"Liquidity ETH to List DEX"}
                  type="numeric"
                  name="liquidityWETH9"
                  value={poolDetail.liquidityWETH9}
                  onChange={onNumericChange}
                  isUnitVisible={true}
                />
              </View>
              <View className="mb-3">
                <Input
                  label={"Liquidity Token to List DEX"}
                  type="numeric"
                  value={poolDetail.liquidityToken}
                  name="liquidityToken"
                  onChange={onNumericChange}
                  isUnitVisible={true}
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
                  />
                </View>
              )}
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
