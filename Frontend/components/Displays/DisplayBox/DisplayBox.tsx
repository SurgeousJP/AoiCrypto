import DataRow from "@/components/Items/Project/DataRow";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/colors";
import { handleCopyToClipboard } from "@/utils/clipboard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  values: {
    tile: string;
    data: any;
  }[];
}

const DisplayBox: React.FC<Props> = ({ title, values }) => {
  return (
    <View className="mt-4">
      <Container>
        <View
          className="bg-surface px-4 py-2 flex flex-col "
        >
          <Text className="font-readexBold text-primary text-md mb-2">
            {title}
          </Text>
          {values.map((item, index) => {
            // Check whether it is too long => it is an address

            if (index === 0 && item.data.toString().length > 28) {
              const copyAddressToClipboard = async () => {
                await handleCopyToClipboard(item.data);
              };
              return (
                <View key={Math.random()} className="w-full flex-row justify-between items-center">
                  <Text className="text-sm font-readexRegular text-secondary">
                    {item.tile}
                  </Text>
                  <Text className="text-sm font-readexRegular text-primary">
                    {item.data.slice(0, 16) + "..."}
                    <TouchableOpacity onPress={copyAddressToClipboard}>
                      <Ionicons
                        name="copy-outline"
                        size={12}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </Text>
                </View>
              );
            }

            return (
              <View key={Math.random()} className={`${index > 0 ? "mt-3" : ""}`}>
                <DataRow key={Math.random()} title={item.tile} data={item.data} />
              </View>
            );
          })}
        </View>
      </Container>
    </View>
  );
};

export default DisplayBox;
