import { colors } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";

interface LoadingModalProps {
  isVisible: boolean;
  task: string;
}

const LoadingModal: React.FC<LoadingModalProps> = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.isVisible}
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-[#0008]">
        <View
          className="flex flex-col w-[348px] p-4 bg-white rounded-md "
          style={{ elevation: 2 }}
        >
          <Text className="font-readexBold text-[20px] mb-4">Please wait</Text>
          <View className="flex flex-row items-center space-x-4">
            <ActivityIndicator size={"large"} color={colors.primary} />
            <Text className="font-readexRegular text-md  text-center">
              {props.task ?? "Transaction pending ..."}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
