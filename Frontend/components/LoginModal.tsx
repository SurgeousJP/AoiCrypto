import { globalStyles } from "@/constants/GlobalStyle";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal(props: LoginModalProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const onInputChange = (setter: any) => (text: any) => {
    setter(text); // Update the specific state variable
  };

  const handleSubmit = () => {
    if (username == "" && password == "") {
      Alert.alert("Login successfully");
      props.onClose();
    } else {
      Alert.alert(
        "Validation Error",
        "Username or password is wrong, please try again"
      );
      return;
    }
  };
  return (
    <View className="mt-10 mx-6 bg-gray-50 p-6 rounded-xl flex flex-col">
      <Text style={globalStyles.fontNormal} className="text-center text-2xl mb-6 font-bold">Sign in</Text>
      <View className="flex flex-col gap-1 mb-4">
        <Text style={globalStyles.fontNormal} className="text-sm">Username</Text>
        <TextInput style={globalStyles.fontNormal}
          className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
          placeholder="Type here..."
          value={username}
          onChangeText={onInputChange(setUsername)}
        />
      </View>
      <View className="flex flex-col gap-1 mb-4">
        <Text style={globalStyles.fontNormal} className="text-sm">Password</Text>
        <TextInput style={globalStyles.fontNormal}
          className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
          placeholder="Type here..."
          secureTextEntry={true}
          value={password}
          onChangeText={onInputChange(setPassword)}
        />
      </View>
      <Pressable style={{ opacity: 0.9 }} onPress={handleSubmit}>
        <Text style={globalStyles.fontBold} className="font-bold text-white mt-6 p-4 w-full h-fit bg-blue-500 self-center justify-center text-center align-middle rounded-lg">
          LOGIN
        </Text>
      </Pressable>
    </View>
  );
}
