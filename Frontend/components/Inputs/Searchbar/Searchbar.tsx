import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Shadow } from "react-native-shadow-2";
import Search from "@/assets/icons/system-icons-svg/Search.svg";
import Close from "@/assets/icons/system-icons-svg/Close.svg";

interface SearchbarProps{
  placeholder?: string,
}

const Searchbar:React.FC<SearchbarProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  return (
    <Shadow
      stretch={true}
      offset={[0, 1]}
      startColor={"#2F66F61F"}
      distance={2}
      style={{ borderRadius: 8 }}
    >
      <View className="flex flex-row bg-white justify-between p-2 rounded-lg shadow-xl">
        <View className="flex flex-row space-x-4 flex-1">
          <Search stroke={isFocused ? colors.primary : colors.secondary} />
          <TextInput
            className="font-readexRegular flex-1"
            placeholder={props.placeholder ?? "AoiCrypto search"}
            placeholderTextColor={colors.outline}
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
        <TouchableOpacity
          onPress={() => {
            setText("");
            setIsFocused(false);
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
    </Shadow>
  );
};

export default Searchbar;
