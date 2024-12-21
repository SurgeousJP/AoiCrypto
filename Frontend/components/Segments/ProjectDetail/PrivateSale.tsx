import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import Container from "@/components/Layouts/Container";
import { ProjectStatus } from "@/constants/enum";
import { AuthContext } from "@/contexts/AuthProvider";
import { useCancelRegisterPrivatePool } from "@/hooks/smart-contract/IDOPool/useCancelRegisterPrivatePool";
import {
  useGetIsUserAllowed,
  useGetProjectByAddress,
} from "@/hooks/useApiHook";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { TransactionReceipt } from "viem";

interface Props {
  project: any;
  token: any;
  status: ProjectStatus | undefined;
}

const PrivateSaleSegment: React.FC<Props> = ({ project, token, status }) => {
  const router = useRouter();
  const client = useApolloClient();
  const navigateToWhitelistApplication = () => {
    router.navigate(`/project/whitelistForm?poolId=${project.poolAddress}`);
  };

  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");

  const [name, symbol, maxSupply] = token?.map((token) => token.result) || [
    "Loading...",
  ];

  const { data: pjMetadata, isLoading: isLoadingMetadata } =
    useGetProjectByAddress(project.poolAddress);

  const { address, chainId } = useContext(AuthContext);

  const { data: isAllowData, isLoading: isAllowedLoading } =
    useGetIsUserAllowed(project.poolAddress, address);

  console.log(isAllowData);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const {
    error: errorCancel,
    errorPrepare: errorPrepareCancel,
    errorWrite: errorWriteCancel,
    isLoading: isLoadingCancel,
    onCancelRegisterPrivatePool,
  } = useCancelRegisterPrivatePool({
    chainId: chainId,
    poolAddress: project.poolAddress,
    enabled: true,
    onSuccess: (data: TransactionReceipt) => {
      // handleCreateAllowlist();
      if (cancelModalVisible) {
        setCancelModalVisible(false);
      }
      showToast(
        "success",
        "Allowlist submitted",
        "Your application has been submitted successfully"
      );
    },
    onError: (error?: Error) => {
      if (cancelModalVisible) {
        setCancelModalVisible(false);
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
    if (cancelModalVisible && errorWriteCancel) {
      setCancelModalVisible(false);
      showToast(
        "error",
        "Error writing transaction",
        errorWriteCancel?.message ?? "N/A"
      );
    }
  }, [errorWriteCancel]);

  const onTriggerCancelRegisterPrivatePool = async () => {
    try {
      setCancelModalVisible(true);
      await onCancelRegisterPrivatePool();
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  return (
    <View className="w-full flex flex-col">
      <LoadingModal
        isVisible={cancelModalVisible}
        task={"Cancelling the register..."}
      />
      <View className="mt-4 flex flex-col w-full">
        <View className="mb-2">
          <Container>
            <View className="bg-surface py-2 px-2 pt-0">
              <View className="w-full flex flex-col mb-2">
                {!isLoadingMetadata &&
                pjMetadata !== undefined &&
                pjMetadata !== null &&
                pjMetadata.imageBannerUrl !== "" ? (
                  <Image
                    source={{
                      uri: pjMetadata.imageBannerUrl,
                    }}
                    style={{
                      width: "100%",
                      aspectRatio: 3 / 2,
                      marginTop: 10,
                    }}
                  />
                ) : (
                  <ImageBackground
                    source={projectIllust}
                    className="w-full h-[183px]"
                  />
                )}
              </View>
              <View className="flex flex-row space-x-2">
                <Image source={projectLogo} className="w-8 h-8" />
                <View className="flex flex-col">
                  <Text className="text-md font-readexBold mb-1">
                    {pjMetadata !== undefined && pjMetadata !== null
                      ? pjMetadata.name
                      : name}
                  </Text>
                  <Text className="text-sm text-secondary font-readexLight mb-1">
                    {pjMetadata !== undefined && pjMetadata !== null
                      ? pjMetadata.overview
                      : ""}
                    {pjMetadata === undefined || pjMetadata === null
                      ? "Sample overview"
                      : ""}
                  </Text>
                </View>
              </View>
            </View>
          </Container>
        </View>

        <View className="mt-3">
          <Container>
            <View className="bg-surface px-4 py-2 flex flex-col">
              <Text className="font-readexBold text-md text-primary">
                Description
              </Text>
              <Text className="font-readexRegular  leading-loose">
                {pjMetadata !== undefined && pjMetadata !== null
                  ? pjMetadata.description
                  : ""}
                {pjMetadata === undefined || pjMetadata === null
                  ? "Sample description"
                  : ""}
              </Text>
            </View>
          </Container>
        </View>

        <View className="mt-4">
          <Container>
            <View className="bg-surface rounded-lg p-4 flex flex-col h-fit">
              {status === ProjectStatus.Ended && (
                <View>
                  <Text className="font-readexRegular text-secondary">
                    The project funding has ended. Thank you for your supports.
                  </Text>
                </View>
              )}
              {status === ProjectStatus.Upcoming &&
                !isAllowedLoading &&
                isAllowData &&
                (!isAllowData.isAllowed ? (
                  <View>
                    <Text className="font-readexRegular">
                      The allowlist for{" "}
                      <Text className="font-readexSemiBold text-primary">
                        {pjMetadata !== undefined && pjMetadata !== null
                          ? pjMetadata.name
                          : name}{" "}
                      </Text>
                      is now available, and you can apply for it below
                    </Text>
                    <View className="mt-3">
                      <PrimaryButton
                        content={"Apply now"}
                        onPress={navigateToWhitelistApplication}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text className="font-readexRegular mb-3">
                      You have applied successfully for this project's
                      allowlist, please patiently wait the start time, or you
                      can cancel the register by click the button
                    </Text>
                    <PrimaryButton
                      content="Cancel register"
                      disabled={isLoadingCancel}
                      onPress={onTriggerCancelRegisterPrivatePool}
                    />
                  </View>
                ))}
              {status === ProjectStatus.Ongoing && (
                <View>
                  <Text className="font-readexRegular">
                    The allowlist for{" "}
                    <Text className="font-readexSemiBold text-primary">
                      {pjMetadata !== undefined && pjMetadata !== null
                        ? pjMetadata.name
                        : name}{" "}
                    </Text>
                    is not available to you since you are not in the allowlist.
                  </Text>
                </View>
              )}
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default PrivateSaleSegment;
