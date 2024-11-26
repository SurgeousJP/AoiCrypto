import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text } from "react-native";

const Description = () => {
  return (
    <View className="mt-2">
      <Container>
        <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
          <Text className="font-readexBold text-md text-primary">
            Highlights
          </Text>
          <Text className="font-readexRegular  leading-loose">
            - Highstreet creates the Shopify experience on an MMORPG for brands
          </Text>
          <Text className="font-readexRegular leading-normal">
            - In an ultimate metaverse experience, users can easily set up shop
            and start interacting with products integrated as in-game objects.
          </Text>
          <Text className="font-readexRegular leading-normal">
            - Highstreet emphasizes hybrid marketplaces, where the rules of how
            a market should work can be rewritten based on the hottest goods.
          </Text>
        </View>
      </Container>
    </View>
  );
};

export default Description;
