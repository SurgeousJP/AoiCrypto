import {
  BIGINT_CONVERSION_FACTOR,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { ProjectStatus, ProjectState } from "@/constants/enum";
import getABI from "@/contracts/utils/getAbi.util";
import { GET_PROJECT_BY_POOL_ID } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useReadContracts } from "wagmi";
import TokenNPool from "./TokenNPool";
import ScreenLoadingIndicator from "@/components/Displays/ScreenLoadingIndicator/ScreenLoadingIndicator";

interface Props {
  poolAddress: string;
}

const getProjectStatusAndCreatedTime = (status: ProjectStatus) => {
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
  status: ProjectStatus
) => {
  const [name, symbol, maxSupply] = token?.map((token) => token.result) || [
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
  ];
};

const ProjectInfo: React.FC<Props> = ({ poolAddress }) => {
  const {
    loading,
    error,
    data: query,
  } = useQuery(GET_PROJECT_BY_POOL_ID, {
    variables: {
      poolId: poolAddress,
    },
  });

  const project = query?.idopool;

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

  const currentDateTstamp = getUnixTimestampFromDate(new Date());
  const isPurelyPrivate = project?.privateSaleAmount === project?.hardCap;
  const isPurelyPublic = project?.idoType === "PUBLIC_SALE";

  const [projectState, setProjectState] = useState<ProjectState | undefined>(
    undefined
  );
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | undefined>(
    undefined
  );

  const [projectOverview, setProjectOverview] = useState<any | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      project !== undefined &&
      projectStatus !== undefined &&
      token !== undefined
    ) {
      setProjectOverview(getProjectOverview(project, token, projectStatus));
    }
  }, [project, projectStatus, token]);

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

  if (
    project === undefined ||
    token === undefined ||
    projectStatus === undefined
  )
    return <ScreenLoadingIndicator />;

  return (
    <ScrollView className="pb-4">
      <View className="bg-surface border-border border-[0.5px] p-4 mt-2">
        <Text className="font-readexBold text-primary text-md">
          Overview
        </Text>
        {projectOverview !== undefined &&
          projectOverview.map((p) => {
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
      <View className="mb-4">
        <TokenNPool project={project!} token={token!} />
      </View>
    </ScrollView>
  );
};

export default ProjectInfo;
