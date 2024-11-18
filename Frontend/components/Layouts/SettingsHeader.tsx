import Ionicons from "@expo/vector-icons/Ionicons"; // Ensure this is installed: `expo install @expo/vector-icons`
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import { colors } from "@/constants/Colors";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";

interface SettingsHeaderProps {
  title: string; // Optional title prop
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between bg-white px-4 py-2">
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Back stroke={colors.secondary} width={24} height={24}/>
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-lg font-readexSemiBold">{title}</Text>

      {/* Search Button */}
      <TouchableOpacity
        onPress={() => console.log("Search button pressed")}
        className="p-2"
      >
        <Ionicons name="search" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsHeader;
