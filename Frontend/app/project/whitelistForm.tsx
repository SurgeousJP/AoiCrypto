import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import { AuthContext } from "@/contexts/AuthProvider";
import { useRegisterPrivatePool } from "@/hooks/smart-contract/IDOPool/useRegisterPrivatePool";
import { useCreateAllowlistEntry } from "@/hooks/useApiHook";
import { UserInfor } from "@/model/ApiModel";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { TransactionReceipt } from "viem";

const WhitelistForm = () => {
  const client = useApolloClient();
  const params = useLocalSearchParams();
  const { poolId } = params;
  const { address, chainId } = useContext(AuthContext);
  console.log("address", address);
  const [userInformation, setUserInformation] = useState<UserInfor>({
    userAddress: address,
    userFullName: "",
    emailAddress: "",
  });

  const handleChange = (name: string, value: string) => {
    setUserInformation({ ...userInformation, [name]: value });
  };

  const createAllowListMutation = useCreateAllowlistEntry();

  const handleCreateAllowlist = () => {
    console.log("poolId", poolId);
    console.log("Start createAllowListMutation");
    console.log("userInformation", userInformation);
    createAllowListMutation.mutate(
      {
        poolAddress: Array.isArray(poolId) ? poolId[0] : poolId,
        userInfors: [userInformation],
        status: "Pending",
      },
      {
        onSuccess: () => {},
        onError: () => {
          showToast("error", "Allowlist submit failed", "Please try again");
        },
      }
    );
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isReadyForRegistered = () => {
    return (
      userInformation.userFullName !== "" &&
      userInformation.emailAddress !== "" &&
      isValidEmail(userInformation.emailAddress)
    );
  };

  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  const {
    error: errorRegister,
    errorPrepare: errorPrepare,
    errorWrite: errorWriteRegister,
    isLoading: isLoadingRegister,
    onRegisterPrivatePool,
  } = useRegisterPrivatePool({
    chainId: chainId,
    poolAddress: poolId,
    enabled: isReadyForRegistered(),
    onSuccess: (data: TransactionReceipt) => {
      handleCreateAllowlist();
      if (registerModalVisible) {
        setRegisterModalVisible(false);
      }
      showToast(
        "success",
        "Allowlist submitted",
        "Your application has been submitted successfully"
      );
    },
    onError: (error?: Error) => {
      if (registerModalVisible) {
        setRegisterModalVisible(false);
      }
      showToast(
        "error",
        "Transaction failed",
        error != undefined ? error.message : "No error"
      );
    },
    onSettled: (data?: TransactionReceipt) => {
      client.resetStore();
      router.back();
    },
  });

  useEffect(() => {
    if (registerModalVisible && errorWriteRegister) {
      setRegisterModalVisible(false);
      showToast(
        "error",
        "Error writing transaction",
        errorWriteRegister?.message ?? "N/A"
      );
    }
    if (registerModalVisible && errorPrepare) {
      setRegisterModalVisible(false);
      showToast(
        "error",
        "Error writing transaction",
        errorPrepare?.message ?? "N/A"
      );
    }
  }, [errorPrepare, errorWriteRegister]);

  const handleRegisterPrivatePool = async () => {
    if (userInformation.userFullName === "") {
      showToast("error", "Invalid input", "User full name is empty");
      return;
    }
    if (userInformation.emailAddress === "") {
      showToast("error", "Invalid input", "User email address");
      return;
    }
    if (!isValidEmail(userInformation.emailAddress)) {
      showToast("error", "Invalid input", "User email is not in correct format");
      return;
    }
    try {
      setRegisterModalVisible(true);
      await onRegisterPrivatePool();
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <LoadingModal
        isVisible={registerModalVisible}
        task={"Registering pool. . ."}
      />
      <View className="p-4">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            <Text className="font-readexBold text-md text-primary">
              Basic Information
            </Text>
            <View className="mt-4">
              <Input
                label={"Wallet address"}
                type={"text"}
                name={""}
                readonly={true}
                initialValue={address}
                onChange={handleChange}
                value={undefined}
              />
            </View>
            <View className="mt-4">
              <Input
                label={"Full name"}
                type={"text"}
                name={"userFullName"}
                value={userInformation.userFullName}
                onChange={handleChange}
              />
            </View>
            <View className="mt-4">
              <Input
                label={"Email address"}
                type={"text"}
                name={"emailAddress"}
                value={userInformation.emailAddress}
                onChange={handleChange}
              />
            </View>
            <View className="mb-2 mt-4">
              <PrimaryButton
                content={"Submit your application"}
                onPress={handleRegisterPrivatePool}
                disabled={isLoadingRegister}
              />
            </View>
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default WhitelistForm;
