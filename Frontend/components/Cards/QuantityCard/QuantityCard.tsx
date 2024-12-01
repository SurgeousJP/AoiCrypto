import React from "react";
import { Text, TextInput, View } from "react-native";

interface QuantityCardProps {
  quantity: number;
  currency: string;
}

function QuantityCard({ quantity: initQuantity, currency }: QuantityCardProps) {
  const [quantity, onChangeText] = React.useState(initQuantity);

  const handleTextChange = (text: string) => {
    onChangeText(Number(text)); // Update state with valid number
  };

  return (
    <View
      className={`flex flex-row rounded-lg items-center shadow-md w-full px-4 py-2.5 bg-white `}
    >
      <View className="flex flex-row items-center justify-between w-full">
        <View>
          <Text className="text-sm font-readexRegular text-gray-500">
            Quantity
          </Text>
          <TextInput
            className="text-md font-readexRegular text-black h-6"
            editable
            multiline
            numberOfLines={1}
            maxLength={50}
            keyboardType="numeric" // Numeric keyboard for mobile devices
            onChangeText={handleTextChange} // Use the updated handler
            value={quantity.toString()}
          />
        </View>
        <Text className="text-md font-readexRegular text-black ml-2">
          {currency}
        </Text>
      </View>
    </View>
  );
}

export default QuantityCard;
