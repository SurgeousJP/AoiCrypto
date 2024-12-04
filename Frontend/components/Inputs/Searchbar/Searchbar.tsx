import Search from "@/assets/icons/system-icons-svg/Search.svg";
import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchbarProps {
  value: any;
  placeholder?: string;
  onChange: (e: any) => void;
  onPerformSearch: () => void;
}

const Searchbar: React.FC<SearchbarProps> = (props) => {
  return (
    <View
      className="flex flex-row bg-background flex-1 items-center px-4 rounded-md py-1 border-border border-[1px]"
      style={{ elevation: 2 }}
    >
      <View className="flex-1">
        <TextInput
          className="font-readexRegular"
          placeholder={props.placeholder ?? "AoiCrypto search"}
          placeholderTextColor={colors.secondary}
          value={props.value}
          onChangeText={props.onChange}
        />
      </View>
      <View className="w-5 h-5">
        <TouchableOpacity onPress={props.onPerformSearch}>
          <Search stroke={colors.secondary} width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Searchbar;
