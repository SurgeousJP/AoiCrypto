import FilePicker from "@/components/utility/FilePicker";
import { useRouter } from "expo-router";
import React from "react";
import { GestureResponderEvent, Pressable, SafeAreaView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ImportPayroll = () => {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const handleNavigate = () => {
    //_sitemap allow to see every route possible
    // router.navigate('/_sitemap');
    router.navigate("/(tabs)/employer");
  };

  

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="items-center my-auto">
        <View className="flex flex-col w-full items-center">
          <Text className="text-xl font-bold">Import payroll</Text>
          <FilePicker></FilePicker>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ImportPayroll;
