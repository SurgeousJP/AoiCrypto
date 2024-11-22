import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Searchbar from "../Inputs/Searchbar/Searchbar";
import { colors } from "@/constants/Colors";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { Link, useRouter } from "expo-router";

interface SearchHeaderProps {
  placeholder?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = (props) => {
  return (
    <View className="flex flex-row justify-between items-center bg-surface px-4 space-x-2 border-b-[0.5px] border-border py-2 pb-3">
      <Searchbar placeholder={props.placeholder ?? "N/A"} />
      <Link href={"/settings"}>
        <Setting fill={colors.secondary} width={24} height={24} />
      </Link>
    </View>
  );
};

export default SearchHeader;
