import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import SettingCard from "@/components/Cards/SettingCard/SettingCard";
import UserCard from "@/components/Cards/UserCard/UserCard";
import { Ionicons } from "@expo/vector-icons";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Switch from "react-native-switch-toggles";

function Settings() {
  const router = useRouter();

  const navToNotificationScreen = () => {
    router.navigate("/notification");
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
          Account
        </Text>
        <View className="rounded-xl" style={{elevation: 2}}>
        <SettingCard
          icon={<Ionicons name="image-outline" color={"gray"} size={24} />}
          title="Theme"
          action={
            <View className="flex flex-row items-center justify-center">
              <Text className="text-slate-500 text-sm font-readexRegular mr-2">
                Dark mode
              </Text>
              <Switch
                value={false}
                activeTrackColor="#45D058"
                onChange={function (value: boolean): void {
                  console.log(value);
                }}
              />
            </View>
          }
          pos={"top"}
        />
        <SettingCard
          icon={
            <Ionicons name="notifications-outline" color={"gray"} size={24} />
          }
          title="Notifications"
          pos={"bot"}
          onChevronClick={navToNotificationScreen}
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
