import NotificationRow from "@/components/Items/Notification/NotificationRow";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList, ActivityIndicator } from "react-native";

const NotificationScreen = () => {

  const [isRendering, setRendering] = useState(true);
  useEffect(() => {
    setRendering(false);
  }, []);

  const userContext = useContext(AuthContext);
  useEffect(() => {
    if (!isRendering && !userContext.isLoading && userContext.status !== 'connected'){
      router.push('/login');
    }
  }, [userContext, isRendering]);

  if (isRendering) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  const data = [
    {
      title: "Whitelist Application Succeeded",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      receiveDate: "31/12/2024",
    },
    {
      title: "Private Sale Invitation",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      receiveDate: "31/12/2024",
    },
    {
      title: "Presale Release Notification",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      receiveDate: "31/12/2024",
    },
  ];

  return (
    <View className="p-4">
      <FlatList
        style={{
          paddingHorizontal: 0,
          borderColor: colors.border,
          borderWidth: 0.5,
          elevation: 1,
        }}
        contentContainerStyle={{ flexGrow: 1, gap: 0 }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          return (
            <NotificationRow title={item.item.title} description={item.item.description} receiveDate={item.item.receiveDate} />
          );
        }}
      />
    </View>
  );
};

export default NotificationScreen;
