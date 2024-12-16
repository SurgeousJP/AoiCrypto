// Import
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import PrivateSaleSegment from "@/components/Segments/ProjectDetail/PrivateSale";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import { colors } from "@/constants/colors";
import { getUnixTimestampFromDate } from "@/constants/conversion";
import { ProjectState, ProjectStatus } from "@/constants/enum";
import { AuthContext } from "@/contexts/AuthProvider";
import getABI from "@/contracts/utils/getAbi.util";
import { useCheckRegisteredPrivatePool } from "@/hooks/smart-contract/IDOPool/useCheckRegisteredPrivatePool";
import { GET_PROJECT_BY_POOL_ID } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useReadContracts } from "wagmi";
// Import

const ProjectDetail = () => {
  const params = useLocalSearchParams();
  const { poolId } = params;

  const {
    loading,
    error,
    data: query,
  } = useQuery(GET_PROJECT_BY_POOL_ID, {
    variables: {
      poolId: poolId,
    },
  });

  const project = query?.idopool;

  const { address, chainId } = useContext(AuthContext);

  const [poolAddress, setPoolAddress] = useState(project?.idopool?.poolAddress);

  useEffect(() => {
    if (project !== undefined && project.idopool !== undefined) {
      setPoolAddress(poolAddress);
    }
  }, [project]);

  const {
    isLoading: isLoadingCheckingRegistered,
    isError: isErrorCheckingRegistered,
    isSuccess: isSuccessCheckingRegistered,
    isRegistered,
  } = useCheckRegisteredPrivatePool({
    chainId,
    poolAddress: poolAddress,
    spenderAddress: address,
    enabled: true,
  });

  console.log("Is registered: ", isRegistered);

  const currentDateTstamp = getUnixTimestampFromDate(new Date());
  const isPurelyPrivate = project?.privateSaleAmount === project?.hardCap;
  const isPurelyPublic = project?.idoType === "PUBLIC_SALE";

  const [projectState, setProjectState] = useState<ProjectState | undefined>(
    undefined
  );

  const [projectStatus, setProjectStatus] = useState<ProjectStatus | undefined>(
    undefined
  );

  useEffect(() => {
    if (loading) {
      return;
    }
    if (isPurelyPublic) {
      setProjectState(ProjectState.Public);
    }
    if (isPurelyPrivate) {
      setProjectState(ProjectState.Private);
    }
    if (isPurelyPrivate || isPurelyPublic) {
      if (currentDateTstamp < project?.startTime) {
        setProjectStatus(ProjectStatus.Upcoming);
        return;
      }
      if (currentDateTstamp > project?.endTime) {
        setProjectStatus(ProjectStatus.Ended);
        return;
      }
      setProjectStatus(ProjectStatus.Ongoing);
      return;
    }

    if (currentDateTstamp < project?.startPublicSale) {
      setProjectState(ProjectState.Private);

      if (currentDateTstamp < project?.startTime) {
        setProjectStatus(ProjectStatus.Upcoming);
        return;
      }
      setProjectStatus(ProjectStatus.Ongoing);
      return;
    }
    if (currentDateTstamp >= project?.startPublicSale) {
      setProjectState(ProjectState.Public);
      if (currentDateTstamp > project?.endTime) {
        setProjectStatus(ProjectStatus.Ended);
        return;
      }
      setProjectStatus(ProjectStatus.Ongoing);
      return;
    }
  }, [loading]);

  const [registered, setRegistered] = useState<boolean | undefined>(undefined);

  // const { data: isAllowData, isLoading: isAllowedLoading } =
  //   useGetIsUserAllowed(poolId, address);

  useEffect(() => {
    if (!isLoadingCheckingRegistered) {
      setRegistered(isRegistered);
    }
  }, [isLoadingCheckingRegistered]);

  const tokenContract = {
    address: project?.tokenPool,
    abi: getABI("AoiERC20"),
  } as const;

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
      {
        ...tokenContract,
        functionName: "MAX_SUPPLY",
      },
    ],
  });

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {(() => {
        // Helper conditions
        const isLoaded =
          !loading &&
          !isLoadingCheckingRegistered &&
          token !== undefined &&
          projectState !== undefined &&
          projectStatus !== undefined;

        const isPrivateSaleActive =
          isLoaded &&
          projectState === ProjectState.Private &&
          isRegistered === true;

        const isPublicSaleActive =
          isLoaded && projectState === ProjectState.Public;

        const isPrivateSaleUnavailable =
          isLoaded &&
          projectState === ProjectState.Private &&
          (isRegistered === false || isRegistered === undefined);

        // console.log("Is private sale active: ", isPrivateSaleActive);
        // console.log("Is public sale active: ", isPublicSaleActive);
        // console.log("Is private sale unavailable: ", isPrivateSaleUnavailable);
        // Main rendering logic
        if (isPrivateSaleActive || isPublicSaleActive) {
          return (
            <View className="py-1">
              <View className="pt-4 flex flex-col">
                <CustomSegmentedControl
                  screens={["Overview", "Token & Pool"]}
                  components={[
                    <Overview
                      project={project!}
                      token={token!}
                      status={projectStatus!}
                    />,
                    <TokenNPool project={project!} token={token!} />,
                  ]}
                />
              </View>
            </View>
          );
        }

        if (isPrivateSaleUnavailable) {
          return (
            <PrivateSaleSegment
              status={projectStatus!}
              project={project!}
              token={token!}
            />
          );
        }

        if (loading || isLoadingCheckingRegistered || token === undefined) {
          return (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          );
        }
        return null; // Default fallback
      })()}
    </ScrollView>
  );
};

export default ProjectDetail;
