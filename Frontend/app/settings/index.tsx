import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import SettingCard from "@/components/Cards/SettingCard/SettingCard";
import UserCard from "@/components/Cards/UserCard/UserCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Switch from "react-native-switch-toggles";

function Settings() {
  return (
    <ScrollView className="w-full pt-8 px-4 bg-background">
      <UserCard />
      <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
        Privacy
      </Text>
      <SettingCard
        icon={
          <Ionicons name="person-circle-outline" color={"gray"} size={24} />
        }
        title="Profile"
        pos={"top"}
      />
      <SettingCard
        icon={
          <Ionicons name="shield-checkmark-outline" color={"gray"} size={24} />
        }
        title="Security"
        pos={"bot"}
      />
      <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
        Finance
      </Text>
      <SettingCard
        icon={
          <Ionicons name="document-text-outline" color={"gray"} size={24} />
        }
        title="History"
        pos={"top"}
      />
      <SettingCard
        icon={<Ionicons name="pie-chart-outline" color={"gray"} size={24} />}
        title="Limits"
        pos={"bot"}
      />
      <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
        Account
      </Text>
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
      />
      <Text className="text-[#696f8c] mt-4 mb-2 ml-4 text-sm font-normal font-readexRegular leading-none">
        More
      </Text>
      <SettingCard
        icon={<Ionicons name="gift-outline" color={"gray"} size={24} />}
        title="My bonus"
        pos={"top"}
      />
      <SettingCard
        icon={<Ionicons name="person-add-outline" color={"gray"} size={24} />}
        title="Share with friends"
        pos={"mid"}
      />
      <SettingCard
        icon={<Ionicons name="help-circle-outline" color={"gray"} size={24} />}
        title="Support"
        pos={"bot"}
      />
      <View className="mt-6">
        <PrimaryButton
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
          content={"Log out"}
          outlined
        />
      </View>
    </ScrollView>
  );
}

export default Settings;
