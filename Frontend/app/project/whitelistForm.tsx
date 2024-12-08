import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import Input from "@/components/Inputs/Input/Input";
import Container from "@/components/Layouts/Container";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const WhitelistForm = () => {
  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            <Text className="font-readexBold text-md text-primary">
              Basic Information
            </Text>
            <View className="mt-4">
              <Input
                label={"Full name"}
                type={"text"}
                name={""}
                value={undefined}
                onChange={function (name: any, value: any): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </View>
            <View className="mt-4">
              <Input
                label={"Email address"}
                type={"text"}
                name={""}
                value={undefined}
                onChange={function (name: any, value: any): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </View>
            <View className="mt-4">
              <Input
                label={"ERC20 Wallet Address"}
                type={"text"}
                name={""}
                value={undefined}
                onChange={function (name: any, value: any): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </View>
            <View className="mb-2 mt-4">
              <NormalButton
                content={"Submit your application"}
                onClick={() => {}}
              />
            </View>
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default WhitelistForm;
