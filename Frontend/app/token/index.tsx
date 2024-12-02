import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text, TextInput } from "react-native";

const TokenForm = () => {
  return (
    <View className="flex-1 bg-background">
      <View className="flex flex-col p-4">
        <View className="mt-2">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Basic Information
              </Text>
              <View className="mb-3">
                <Text className="font-readexRegular">Name</Text>
                <TextInput className="border-border border-1"></TextInput>
              </View>
              <View className="mb-3">
                <Input label={"Price per token"} />
              </View>
              <View className="mb-3">
                <Input label={"Raised amount"} />
              </View>
            </View>
          </Container>
        </View>
      </View>
    </View>
  );
};

export default TokenForm;
