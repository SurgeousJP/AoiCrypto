import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import Input from "@/components/Inputs/Input/Input";
import LabelInput from "@/components/Inputs/Input/LabelInput";
import Container from "@/components/Layouts/Container";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { useCreateNewERC20 } from "@/hooks/smart-contract/AoiERC20/useCreateNewERC20";
import { showToast } from "@/utils/toast";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TransactionReceipt } from "viem";

const TokenForm = () => {
  const [name, setName] = useState("ELYSIA");
  const [symbol, setSymbol] = useState("$ELY");
  const [initialSupply, setInitialSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const [isRendering, setRendering] = useState(true);
  useEffect(() => {
    setRendering((loading) => false);
  }, []);

  const { chainId, address, isConnected } = useContext(AuthContext);

  const [isLoadingModalVisible, setLoadingModalVisible] = useState(false);

  const {
    error,
    isLoading,
    isSuccess,
    isError,
    onCreateNewERC20: onExecute,
  } = useCreateNewERC20({
    chainId: chainId,
    newERC20: {
      name: name,
      symbol: symbol,
      initialSupply: BigInt(initialSupply * BIGINT_CONVERSION_FACTOR),
      maxTotalSupply: BigInt(maxSupply * BIGINT_CONVERSION_FACTOR),
    },
    enabled: true,
    onSuccess: (data: TransactionReceipt) => {
      showToast(
        "success",
        "Transaction success",
        "Create new token successfully"
      );
    },
    onError: (error?: Error) => {
      showToast("error", "Transaction failed", error.message);
    },
    onSettled: (data?: TransactionReceipt) => {
    },
  });

  const onTriggerCreateNewToken = () => {
    if (name === ""){
      showToast("error", "Form invalid", "The token name field is empty");
      return;
    }
    if (symbol === ""){
      showToast("error", "Form invalid", "The token symbol field is empty");
      return;
    }
    if (initialSupply <= 0){
      showToast("error", "Form invalid", "The initialSupply value is less than zero or empty");
      return;
    }
    if (maxSupply <= 0){
      showToast("error", "Form invalid", "The maxSupply value is less than zero or empty");
      return;
    }
    if (initialSupply > maxSupply){
      showToast("error", "Form invalid", "The initialSupply value must be smaller than maxSupply value");
      return;
    }
    setLoadingModalVisible(true);
  };

  useEffect(() => {
    if (isLoadingModalVisible) {
      onSmartContractExecute();
    }
  }, [isLoadingModalVisible]);

  const onSmartContractExecute = async () => {
    try {
      console.log('Executing smart contract');
      await onExecute();
    } catch (error: any) {
      // DO NOTHING
    }
    setLoadingModalVisible(false);
    setName("");
    setSymbol("");
    setInitialSupply(0);
    setMaxSupply(0);
  };

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
              <View className="mb-3">
                <LabelInput
                  type={"text"}
                  title={"Token name"}
                  name={"name"}
                  value={name}
                  placeholder={"Token name"}
                  onChange={setName}
                />
              </View>
              <View className="mb-3">
                <LabelInput
                  type={"text"}
                  title={"Token symbol"}
                  name={"symbol"}
                  value={symbol}
                  placeholder={""}
                  onChange={setSymbol}
                />
              </View>
              <View className="mb-3">
                <LabelInput
                  type={"numeric"}
                  title={"Initial supply"}
                  name={"initialSupply"}
                  value={initialSupply}
                  placeholder={""}
                  onChange={setInitialSupply}
                />
              </View>
              <View className="mb-3">
                <LabelInput
                  type={"numeric"}
                  title={"Max supply"}
                  name={"maxSupply"}
                  value={maxSupply}
                  placeholder={""}
                  onChange={setMaxSupply}
                />
              </View>

              <View className="w-full mt-1 mb-3">
                <PrimaryButton
                  onPress={onTriggerCreateNewToken}
                  content={"Create token"}
                />
              </View>
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default TokenForm;
