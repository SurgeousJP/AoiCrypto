import NotificationRow from "@/components/Items/Notification/NotificationRow";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, View, Text, FlatList } from "react-native";

const NotificationScreen = () => {
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
