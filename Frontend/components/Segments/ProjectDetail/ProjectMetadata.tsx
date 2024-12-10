import Input from "@/components/Inputs/Input/Input";
import TextAreaInput from "@/components/Inputs/Input/TextAreaInput";
import Container from "@/components/Layouts/Container";
import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";

const ProjectMetadataSegment = () => {
  const [description, setDescription] = useState("");
  const onChangeDescription = (name, value) => {
    setDescription(value);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2"
    >
      <View>
        <Container>
          <View
            className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
            style={{ elevation: 2 }}
          >
            <Text className="font-readexBold text-md text-primary mb-2">
              Project Information
            </Text>
            <View className="mb-3">
              <Input
                label={"Project name"}
                name={"name"}
                // value={poolDetails.tokenAddress}
                type="text"
                // onChange={onTokenAddressChange}
                // initialValue={poolDetails.tokenAddress}
              />
            </View>
            <View className="mb-3">
              <Input
                label={"Overview"}
                name={"overview"}
                // value={poolDetails.pricePerToken}
                type="text"
                // onChange={onNumericChange}
                // initialValue={poolDetails.pricePerToken}
              />
            </View>
            <TextAreaInput
              title={"Description"}
              type={"text"}
              initialValue={""}
              value={description}
              onChange={onChangeDescription}
              name={"description"}
              placeholder={""}
              isUnitVisible={false}
            />
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default ProjectMetadataSegment;
