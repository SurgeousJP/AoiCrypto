import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Search from "@/assets/icons/system-icons-svg/Search.svg";

interface SearchbarProps {
  placeholder?: string;
}

const Searchbar: React.FC<SearchbarProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
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
          value={text}
          onChangeText={(text) => setText(text)}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
      </View>
      <TouchableOpacity>
        <Search stroke={colors.secondary} width={20} height={2}/>
      </TouchableOpacity>
    </View>
  );
};

export default Searchbar;
