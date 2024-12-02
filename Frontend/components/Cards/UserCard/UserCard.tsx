import { colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { showToast } from "@/utils/toast";

function UserCard() {
  const { address } = useContext(AuthContext);

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    const clipboard = await Clipboard.getStringAsync();
    showToast('info', 'Copied address to clipboard', clipboard);
  };

  return (
    <View
      className="px-4 py-2 bg-white rounded-2xl shadow flex flex-row justify-between items-center border-border border-[0.5px]"
      style={{ elevation: 2 }}
    >
      <View className="flex flex-col justify-between flex-1">
        <View className="flex flex-row justify-between flex-wrap items-center">
          <Image
            className="w-10 h-10 rounded-full inline-block"
            source={{ uri: "https://pbs.twimg.com/media/FY444MZUEAA1RPA.jpg" }}
          />
          <View className="flex flex-row items-center flex-1 space-x-2">
            <Text
              style={{
                lineHeight: 14,
              }}
              className="text-black text-sm ml-3 font-readexSemiBold break-words inline flex-1"
            >
              {address}
            </Text>
            <TouchableOpacity onPress={handleCopyToClipboard}>
              <Ionicons
                name="copy-outline"
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row items-center mt-1">
          <Text className="text-slate-900 text-md font-readexRegular leading-none mr-1">
            0.25 <Text className="text-secondary">SEPOLIAETH</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

export default UserCard;
