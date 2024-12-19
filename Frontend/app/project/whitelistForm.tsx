import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import { AuthContext } from "@/contexts/AuthProvider";
import { useCreateAllowlistEntry } from "@/hooks/useApiHook";
import { UserInfor } from "@/model/ApiModel";
import { showToast } from "@/utils/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const WhitelistForm = () => {
  const params = useLocalSearchParams();
  const { poolId } = params;
  const { address } = useContext(AuthContext);
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

  const handleSubmit = () => {
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
        onSuccess: () => {
          showToast(
            "success",
            "Allowlist submitted",
            "Your application has been submitted successfully"
          );
        },
        onError: () => {
          showToast("error", "Allowlist submit failed", "Please try again");
        },
      }
    );
  };

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            <Text className="font-readexBold text-md text-primary">
              Basic Information
            </Text>
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
            <View className="mt-4">
              <Input
                label={"ERC20 Wallet Address"}
                type={"text"}
                name={""}
                readonly={true}
                initialValue={address}
                onChange={handleChange}
                value={undefined}
              />
            </View>
            <View className="mb-2 mt-4">
              <NormalButton
                content={"Submit your application"}
                onClick={handleSubmit}
              />
            </View>
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default WhitelistForm;
