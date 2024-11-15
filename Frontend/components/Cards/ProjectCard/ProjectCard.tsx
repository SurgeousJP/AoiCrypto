import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ProjectCardProps {
  projectLogoUrl: string;
  projectName: string;
  projectShortName: string;
  price: number;
  numOfInvestors: number;
  color: "green" | "red";
}

function ProjectCard({
  projectLogoUrl,
  projectName,
  projectShortName,
  price,
  numOfInvestors,
  color,
}: ProjectCardProps) {
  return (
    <View className="flex flex-row rounded-lg items-center shadow-sm w-[343px] h-[68px]  p-4 bg-white justify-between">
      <View className="flex flex-row items-center">
        <Ionicons name="swap-vertical" size={24} />
        <View className="flex flex-row items-center">
          <View className=" ml-2">
            <Text className="text-md font-readexRegular text-black">
              {projectName}
            </Text>
            <Text className="text-sm font-readexRegular text-gray-500">
              {projectShortName}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-col mr-2 items-end">
        <Text className="text-md font-readexRegular text-black">
          ${price.toLocaleString()}
        </Text>
        <Text
          className={`text-sm font-readexRegular ${
            color === "green" ? "text-green-600" : "text-red-600"
          }`}
        >
          {numOfInvestors} funders
        </Text>
      </View>
    </View>
  );
}

export default ProjectCard;
