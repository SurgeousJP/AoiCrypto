import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Searchbar from "../Inputs/Searchbar/Searchbar";

interface SearchHeaderProps {
  placeholder?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = (props) => {
  return (
    <View
      className="flex flex-row justify-between items-center bg-surface px-4 space-x-2 border-b-[0.5px] border-border py-2 pb-3"
      style={{ elevation: 2 }}
    >
      <Searchbar placeholder={props.placeholder ?? "N/A"} />
      <TouchableOpacity onPress={() => {}}>
        <Link href={"/settings"}>
          <Setting fill={colors.secondary} width={24} height={24} />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default SearchHeader;
