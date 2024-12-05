import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import SettingCard from "@/components/Cards/SettingCard/SettingCard";
import UserCard from "@/components/Cards/UserCard/UserCard";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const AdminSetting = () => {
  const router = useRouter();

  const navToNotificationScreen = () => {
    router.navigate("/notification");
  };

  const navToBuyerUI = () => {
    router.navigate("/(tabs)");
  };

  const { open } = useAppKit();
  const openWalletModal = () => {
    open();
  };
  
  return (
    <ScrollView
      className="flex flex-col w-full bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="border-b-[0.2px] border-border" style={{ elevation: 2 }}>
        <View className="flex flex-row justify-between items-center bg-surface py-2 px-4">
          <Text className="text-[20px] font-readexSemiBold text-center mx-auto">
            Setting
          </Text>
        </View>
      </View>

      <View className="pt-8 px-4 pb-4">
        <UserCard />
        <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
          Role & Notifications
        </Text>
        <View className="rounded-xl" style={{ elevation: 1 }}>
          <SettingCard
            icon={<Profile width={24} height={24} stroke={colors.secondary} />}
            title="Seller"
            action={
              <TouchableOpacity onPress={navToBuyerUI}>
                <Text className="text-primary text-sm font-readexRegular">
                  Switch role
                </Text>
              </TouchableOpacity>
            }
            pos={"top"}
          />
          <SettingCard
            icon={
              <Ionicons name="notifications-outline" color={"gray"} size={24} />
            }
            title="Notifications"
            pos={"bot"}
            action={
              <TouchableOpacity onPress={navToNotificationScreen}>
                <Text className="text-primary text-sm font-readexRegular">
                  See
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View className="mt-6">
          <PrimaryButton
            onPress={openWalletModal}
            content={"Open wallet modal"}
            outlined
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminSetting;
