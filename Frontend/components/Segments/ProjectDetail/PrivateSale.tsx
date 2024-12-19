import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import Container from "@/components/Layouts/Container";
import { getDateFromUnixTimestamp } from "@/constants/conversion";
import { ProjectStatus } from "@/constants/enum";
import { AuthContext } from "@/contexts/AuthProvider";
import {
  useGetIsUserAllowed,
  useGetProjectByAddress,
} from "@/hooks/useApiHook";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";

interface Props {
  project: any;
  token: any;
  status: ProjectStatus | undefined;
}

const PrivateSaleSegment: React.FC<Props> = ({ project, token, status }) => {
  const router = useRouter();
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
  const [modalVisible, setModalVisible] = useState(false);

  const { data: isAllowData, isLoading: isAllowedLoading } =
    useGetIsUserAllowed(project.poolAddress, address);

  console.log(isAllowData);

  return (
    <View className="w-full flex flex-col">
      <LoadingModal isVisible={modalVisible} task={"Registering pool. . ."} />
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
              {status === ProjectStatus.Upcoming && (
                <View>
                  <Text className="font-readexRegular">
                    The allowlist for{" "}
                    <Text className="font-readexSemiBold text-primary">
                      {pjMetadata !== undefined && pjMetadata !== null
                        ? pjMetadata.name
                        : name}{" "}
                    </Text>
                    is currently unavailable right now, please wait until the
                    start time (
                    {
                      getDateFromUnixTimestamp(project.createdTime)
                        .toISOString()
                        .split("T")[0]
                    }
                    )
                  </Text>
                </View>
              )}
              {status === ProjectStatus.Ongoing &&
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
                    <Text className="font-readexRegular">
                      You have applied for this project's allowlist, please
                      patiently wait for the response from the seller.
                    </Text>
                  </View>
                ))}
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default PrivateSaleSegment;
