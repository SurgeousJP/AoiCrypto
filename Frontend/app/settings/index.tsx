import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import SettingCard from "@/components/Cards/SettingCard/SettingCard";
import UserCard from "@/components/Cards/UserCard/UserCard";
import { Ionicons } from "@expo/vector-icons";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import { colors } from "@/constants/colors";
function Settings() {
  const router = useRouter();

  const navToNotificationScreen = () => {
    router.navigate("/notification");
  };

  const navToSellerUI = () => {
    router.navigate("/seller");
  }

  const { open } = useAppKit();
  const openWalletModal = () => {
    open();
  };

  return (
    <ScrollView
      className="flex flex-col w-full bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="pt-8 px-4 pb-4">
        <UserCard />
        <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
          Role & Notifications
        </Text>
        <View className="rounded-xl" style={{ elevation: 2 }}>
          <SettingCard
            icon={<Profile width={24} height={24} stroke={colors.secondary} />}
            title="Buyer"
            action={
              <TouchableOpacity onPress={navToSellerUI}>
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
            action = {
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
}

export default Settings;
