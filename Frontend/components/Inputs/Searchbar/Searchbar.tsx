import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";

const Searchbar = () => {
  const searchIcon = require("@/assets/icons/system-icons/Search_alt_light.png");
  const closeIcon = require("@/assets/icons/system-icons/close_ring_light.png");
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  return (
    <View className="flex flex-row bg-white justify-between p-2 rounded-lg shadow-xl">
      <View className="flex flex-row space-x-4 flex-1">
        <Image
          className="w-6 h-6"
          source={searchIcon}
          tintColor={isFocused ? colors.primary : colors.secondary}
        />
        <TextInput
          className="font-readexRegular flex-1"
          placeholder="AoiCrypto search"
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
      <TouchableOpacity onPress={() => {
        setText("");
        setIsFocused(false);
      }}>
        <Image
          className="w-6 h-6"
          source={closeIcon}
          tintColor={isFocused ? colors.primary : colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Searchbar;
