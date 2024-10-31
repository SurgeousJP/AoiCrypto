import { LoginModal } from "@/components/LoginModal";
import { globalStyles } from "@/constants/GlobalStyle";
import { ProofCalculationRequest } from "@/models/SalaryAPIModels";
import SalaryAPI from "@/services/SalaryAPI";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [isPayrollBtnVisible, setPayrollBtnVisible] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [lower, setLower] = useState<string>("");
  const [upper, setUpper] = useState<string>("");
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onLoginClose = () => {
    console.log("onLoginClose");
    setPayrollBtnVisible(true);
  };

  const handleProve = async () => {
    const requestData: ProofCalculationRequest = {
      identifier,
      salary,
      lower: Number(lower),
      upper: Number(upper),
    };

    try {
      setLoading(true);
      const response = await SalaryAPI.calculateProof(requestData);
      console.log(response.data);
      if (response.data && response.data.data) {
        setQrData(JSON.stringify(response.data.data));
      }
    } catch (error: any) {
      // console.error("Error calculating proof:", error);
      // console.error("Error uploading file during request:", error);
      console.error("Error preflight during request:", error.message); // Log the error message
      if (error.response) {
        // The request was made, and the server responded with a status code outside of the 2xx range
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Response data:", error.response.data); // Server's response
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No response received:", error.request); // Logs details of the request
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up request:", error.message);
      }
      console.error("Full error object:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {!isPayrollBtnVisible && <LoginModal onClose={onLoginClose} />}

      {isPayrollBtnVisible && (
        <View className="mt-10 mx-6 bg-gray-50 p-6 rounded-xl flex flex-col">
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm" style={globalStyles.fontNormal}>
              Identifier
            </Text>
            <TextInput
              style={globalStyles.fontNormal}
              className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
              placeholder="Type here..."
              value={identifier}
              onChangeText={setIdentifier} // Update state on change
            />
          </View>
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm" style={globalStyles.fontNormal}>
              Salary (VND)
            </Text>
            <TextInput
              style={globalStyles.fontNormal}
              className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
              placeholder="Type here..."
              value={salary}
              onChangeText={setSalary} // Update state on change
            />
          </View>
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm" style={globalStyles.fontNormal}>
              Lowerbound (VND)
            </Text>
            <TextInput
              style={globalStyles.fontNormal}
              className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
              placeholder="Type here..."
              value={lower}
              onChangeText={setLower} // Update state on change
            />
          </View>
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm" style={globalStyles.fontNormal}>
              Upperbound (VND)
            </Text>
            <TextInput
              className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
              placeholder="Type here..."
              value={upper}
              onChangeText={setUpper} // Update state on change
            />
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={handleProve}>
            <Text
              className="text-white font-bold mt-6 p-4 w-full h-fit bg-blue-500 self-center justify-center text-center align-middle rounded-lg"
            >
              Prove
            </Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff" // You can change this color
              style={{ marginTop: 20 }} // Add some margin if necessary
            />
          ) : (
            qrData && (
              <View className="mt-6 self-center">
                <QRCode value={qrData} size={150} />
              </View>
            )
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
