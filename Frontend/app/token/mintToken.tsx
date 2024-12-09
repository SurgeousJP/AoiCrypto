import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import LabelInput from "@/components/Inputs/Input/LabelInput";
import Container from "@/components/Layouts/Container";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { useMintToken } from "@/hooks/smart-contract/AoiERC20/useMintToken";
import { clearCache } from "@/queries/util";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { TransactionReceipt } from "viem";


const MintTokenForm = ({ route }) => {
  const token = useLocalSearchParams();

  const { chainId, address, isConnected } = useContext(AuthContext);

  const [isLoadingModalVisible, setLoadingModalVisible] = useState(false);
  const client = useApolloClient();

  const [mintValue, setMintValue] = useState(0);

  const { error, errorWrite, isLoading, isSuccess, isError, onMintToken: onExecute } =
    useMintToken({
      chainId: chainId,
      tokenAddress: token.tokenAddress,
      address: address,
      numOfTokensMint: BigInt(mintValue * BIGINT_CONVERSION_FACTOR),
      enabled: true,
      onSuccess: (data: TransactionReceipt) => {
        if (isLoadingModalVisible) {
          setLoadingModalVisible(false);
        }

        showToast("success", "Transaction success", "Mint tokens successfully");
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
        resetTokenFormState();
        router.back();
      },
    });

  const onTriggerMintToken = async () => {
    if (mintValue <= 0) {
      showToast(
        "error",
        "Form invalid",
        "The number of mint tokens must be positive"
      );
      return;
    }

    if (mintValue >= Number(token.maxTotalSupply)){
      showToast(
        "error",
        "Form invalid",
        `The number of mint tokens must be less than max total supply (${token.maxTotalSupply})`
      );
      return;
    }

    setLoadingModalVisible(true);
    await onExecute();
  };

  const resetTokenFormState = () => {
    setMintValue(0);
  };

  const onInputChange = (name: any, value: any) => {
    setMintValue(value);
  };

  useEffect(() => {
    if (isLoadingModalVisible && errorWrite) {
      setLoadingModalVisible(false);
      showToast("error", "Error writing transaction", error?.message ?? "N/A");
    }
  }, [errorWrite, error]);

  return (
    <View className="flex-1 bg-background">
      <LoadingModal
        isVisible={isLoadingModalVisible}
        task={"Creating new token ..."}
      />
      <View className="flex flex-col p-4">
        <View className="mt-2">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Token Information
              </Text>
              <View>
                <Text className="font-readexRegular text-secondary">
                  Selected token:{" "}
                  <Text className="font-readexSemiBold text-black">
                    {token.name}
                  </Text>
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="font-readexRegular text-secondary">
                  Max supply:{" "}
                  
                </Text>
                <Text className="font-readexSemiBold text-black">
                    {token.maxSupply}
                  </Text>
              </View>
              <View className="mb-3">
                <LabelInput
                  type={"text"}
                  title={"Number of mint tokens"}
                  name={""}
                  value={mintValue}
                  placeholder={""}
                  onChange={onInputChange}
                  initialValue={mintValue}
                />
              </View>

              <View className="w-full mt-1 mb-3">
                <PrimaryButton
                  onPress={onTriggerMintToken}
                  content={"Mint token"}
                  disabled={isLoading}
                />
              </View>
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default MintTokenForm;
