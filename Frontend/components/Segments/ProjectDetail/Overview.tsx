//IMPORT
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { ProjectStatus } from "@/constants/enum";
import { AuthContext } from "@/contexts/AuthProvider";
import getABI from "@/contracts/utils/getAbi.util";
import { useCancelInvestment } from "@/hooks/smart-contract/IDOPool/useCancelInvestment";
import { useInvestPool } from "@/hooks/smart-contract/IDOPool/useInvestPool";
import { useGetProjectByAddress } from "@/hooks/useApiHook";
import { Project } from "@/model/ApiModel";
import { showToast } from "@/utils/toast";
import { useApolloClient } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { TransactionReceipt } from "viem";
import { useBalance, useReadContracts } from "wagmi";
// IMPORT

interface Props {
  project: any;
  token: any;
  status: ProjectStatus | undefined;
}

export const getProjectStatusAndCreatedTime = (status: ProjectStatus) => {
  let projectStatus = "";
  let projectStatusStyle = "";
  if (status === ProjectStatus.Upcoming) {
    projectStatus = "Upcoming";
    projectStatusStyle = "text-primary";
  } else if (status === ProjectStatus.Ended) {
    projectStatus = "Ended";
    projectStatusStyle = "text-secondary";
  } else {
    projectStatus = "Ongoing";
    projectStatusStyle = "text-success";
  }

  return { projectStatus, projectStatusStyle };
};

const getProjectOverview = (
  project: any,
  token: any,
  status: ProjectStatus,
  depositData: any
) => {
  const [name, symbol, maxSupply] = token?.map((token) => token.result) || [
    "Loading...",
  ];

  const [depositAmount] = depositData?.map((data) => data.result) || [
    "Loading...",
  ];

  const { projectStatus, projectStatusStyle } =
    getProjectStatusAndCreatedTime(status);

  return [
    { label: "Status", data: projectStatus, textDataStyle: projectStatusStyle },
    {
      label: "Sale Type",
      data: project.idoType === "PUBLIC_SALE" ? "Public" : "Private",
      textDataStyle: "text-primary",
    },
    {
      label: "Min Buy",
      data:
        (project.minInvest / BIGINT_CONVERSION_FACTOR).toString() +
        " ETH " +
        "(" +
        (project.minInvest / project.pricePerToken).toString() +
        " " +
        symbol +
        ")",
      textDataStyle: "text-black",
    },
    {
      label: "Max Buy",
      data:
        (project.maxInvest / BIGINT_CONVERSION_FACTOR).toString() +
        " ETH " +
        "(" +
        (project.maxInvest / project.pricePerToken).toString() +
        " " +
        symbol +
        ")",
      textDataStyle: "text-black",
    },
    {
      label: "Current Rate",
      data: `1 ETH = ${
        1 / (project.pricePerToken / BIGINT_CONVERSION_FACTOR)
      } ${symbol}`,
      textDataStyle: "text-black",
    },
    {
      label: "Current Raised",
      data:
        (project.raisedAmount / BIGINT_CONVERSION_FACTOR).toString() + " ETH",
      textDataStyle: "text-black",
    },
    {
      label: "Total Contributors",
      data: project.investors.length,
      textDataStyle: "text-black",
    },
    ...(Number(depositAmount) / BIGINT_CONVERSION_FACTOR > 0
      ? [
          {
            label: "You purchased",
            data: Number(depositAmount) / BIGINT_CONVERSION_FACTOR + " ETH",
            textDataStyle: "text-black",
          },
        ]
      : []),
  ];
};

const Overview: React.FC<Props> = ({ project, token, status }) => {
  const { address, chainId } = useContext(AuthContext);
  const client = useApolloClient();

  const userContract = {
    address: project.poolAddress,
    abi: getABI("IDOPool"),
  } as const;

  const { data: depositData } = useReadContracts({
    contracts: [
      {
        ...userContract,
        functionName: "getUserDepositAmount",
        args: [address],
      },
    ],
  });

  const [depositAmount] = depositData?.map(
    (data) => Number(data.result) / BIGINT_CONVERSION_FACTOR
  ) || ["Loading..."];

  const projectOverview = getProjectOverview(
    project,
    token,
    status,
    depositData
  );
  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");

  const [name, symbol, maxSupply] = token?.map((token) => token.result) || [
    "Loading...",
  ];
  const { projectStatus } = getProjectStatusAndCreatedTime(status);
  const [investAmount, setInvestAmount] = useState(0);
  const onChangeInvestAmount = (name: any, value: any) => {
    setInvestAmount(value);
  };

  const { data: ethBalance, isLoading: isLoadingBalance } = useBalance({
    address: address,
  });

  const [maxAmountInvest, setMaxAmountInvest] = useState(0);
  useEffect(() => {
    if (ethBalance !== undefined) {
      setMaxAmountInvest(
        ethBalance.value > project.maxInvest
          ? project.maxInvest / BIGINT_CONVERSION_FACTOR
          : Number(ethBalance.value) / BIGINT_CONVERSION_FACTOR
      );
    }
  }, [ethBalance]);

  const { data: pjMetadata, isLoading: isLoadingMetadata } =
    useGetProjectByAddress(project.poolAddress);

  const isInvestAmountValid = () => {
    if (
      investAmount <= 0 ||
      investAmount > Math.round((maxAmountInvest - depositAmount) * 1e10)
    ) {
      return false;
    }

    return true;
  };

  const [investModalVisible, setInvestModalVisible] = useState(false);
  const [cancelInvestModalVisible, setCancelInvestModalVisible] =
    useState(false);

  const { error, errorWrite, isLoading, isSuccess, isError, onInvestPool } =
    useInvestPool({
      chainId: chainId,
      proof: [],
      poolAddress: project.poolAddress,
      investETHAmount: BigInt(investAmount * BIGINT_CONVERSION_FACTOR),
      enabled: isInvestAmountValid(),
      onSuccess: (data: TransactionReceipt) => {
        if (investModalVisible) {
          setInvestModalVisible(false);
        }

        showToast("success", "Transaction success", "Invest successfully");
      },
      onError: (error?: Error) => {
        if (investModalVisible) {
          setInvestModalVisible(false);
        }

        showToast(
          "error",
          "Transaction failed",
          error != undefined ? error.message : "No error"
        );
      },
      onSettled: (data?: TransactionReceipt) => {
        client.resetStore();
        setInvestAmount(0);
      },
    });

  const onTriggerInvestPool = async () => {
    if (!isInvestAmountValid()) {
      showToast("error", "Invalid input", "The invest amount must be positive");
      return;
    }
    setInvestModalVisible(true);
    await onInvestPool();
  };

  const {
    error: errorCancel,
    errorWrite: errorWriteCancel,
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    onCancelInvestment,
  } = useCancelInvestment({
    chainId: chainId,
    poolAddress: project.poolAddress,
    enabled: Number(depositAmount) > 0,
    onSuccess: (data: TransactionReceipt) => {
      if (cancelInvestModalVisible) {
        setCancelInvestModalVisible(false);
      }

      showToast("success", "Transaction success", "Cancel investment successfully");
    },
    onError: (error?: Error) => {
      if (cancelInvestModalVisible) {
        setCancelInvestModalVisible(false);
      }

      showToast(
        "error",
        "Transaction failed",
        error != undefined ? error.message : "No error"
      );
    },
    onSettled: (data?: TransactionReceipt) => {
      client.resetStore();
      setInvestAmount(0);
    },
  });

  const onTriggerCancelInvestment = async () => {
    setCancelInvestModalVisible(true);
    await onCancelInvestment();
  }

  useEffect(() => {
    if (investModalVisible && errorWrite) {
      setInvestModalVisible(false);
      showToast("error", "Error writing transaction", error?.message ?? "N/A");
    }
  }, [errorWrite]);

  useEffect(() => {
    if (cancelInvestModalVisible && errorWriteCancel){
      setCancelInvestModalVisible(false);
      showToast("error", "Error writing transaction", errorCancel?.message ?? "N/A");
    }
  }, [errorWriteCancel]);

  return (
    <View className="w-full flex flex-col">
      <LoadingModal
        isVisible={investModalVisible}
        task={"Initiating investment. . ."}
      />
      <LoadingModal
        isVisible={cancelInvestModalVisible}
        task={"Initiating cancel investment. . ."}
      />
      <View className="mt-3 flex flex-col w-full">
        <View className="mb-3">
          <Container>
            <View className="bg-surface px-4 py-2 pt-0">
              <View className="w-full flex flex-col mb-2">
                {!isLoading &&
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
              <View className="flex flex-row space-x-2 w-full">
                <Image source={projectLogo} className="w-8 h-8" />
                <View className="flex flex-col">
                  <Text className="text-md font-readexBold mb-1">
                    {pjMetadata !== undefined && pjMetadata !== null
                      ? pjMetadata.name
                      : name}
                  </Text>
                  <Text className="text-sm text-secondary font-readexLight mb-1 break-words">
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

        <Container>
          <View className="bg-surface p-4 flex flex-col h-fit">
            <Progress.Bar
              color={colors.primary}
              unfilledColor={"#EDF2F7"}
              progress={project.raisedAmount / project.hardCap}
              width={null}
              borderWidth={0}
              height={12}
              borderRadius={6}
            />
            <View className="flex flex-row justify-between mt-3 mb-3">
              <Text className="font-readexRegular">
                {project.raisedAmount / BIGINT_CONVERSION_FACTOR}{" "}
                <Text className="text-secondary">ETH</Text>
              </Text>
              <Text className="font-readexRegular">
                {project.softCap / BIGINT_CONVERSION_FACTOR}{" "}
                <Text className="text-secondary">ETH</Text>
              </Text>
            </View>

            {projectStatus === "Ongoing" && depositAmount !== undefined && (
              <View className="flex flex-col mt-3">
                <Input
                  type="numeric"
                  label={`Amount (Max: ${
                    Number(depositAmount) <= 0
                      ? maxAmountInvest
                      : Math.round((maxAmountInvest - depositAmount) * 1e10) /
                        1e10
                  } ETH)`}
                  name={""}
                  value={investAmount}
                  onChange={onChangeInvestAmount}
                />
                <View>
                  <Text className="font-readexRegular text-primary">
                    You will receive{" "}
                    {(investAmount / project.pricePerToken) *
                      BIGINT_CONVERSION_FACTOR}{" "}
                    {symbol}{" "}
                    <Text className="font-readexSemiBold">(Estimated)</Text>
                  </Text>
                </View>
                <View className="mt-3">
                  <PrimaryButton
                    content={`Import $${symbol} to wallet`}
                    onPress={onTriggerInvestPool}
                    disabled={isLoading}
                  />
                </View>
                {depositAmount > 0 && (
                  <View className="mt-3">
                    <PrimaryButton
                      disabled={isLoadingCancel}
                      onPress={onTriggerCancelInvestment}
                      content={"Emergency withdrawal"}
                      outlined
                    />
                  </View>
                )}
              </View>
            )}
            {projectStatus === "Upcoming" && (
              <Text className="font-readexRegular text-primary">
                The project funding has not started yet. Please wait until the
                start time.
              </Text>
            )}
            {projectStatus === "Ended" && (
              <Text className="font-readexRegular text-secondary">
                The project funding has ended.
              </Text>
            )}
          </View>
        </Container>
      </View>
      <View className="mt-3 flex-1">
        <Container>
          <View className="bg-surface px-4 py-2 flex flex-col">
            {projectOverview.map((p) => {
              return (
                <View
                  key={p.label}
                  className="flex flex-row justify-between mt-3"
                >
                  <Text className="font-readexRegular text-secondary">
                    {p.label}
                  </Text>
                  <Text className={`font-readexRegular ${p.textDataStyle}`}>
                    {p.data}
                  </Text>
                </View>
              );
            })}
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
    </View>
  );
};

export default Overview;
