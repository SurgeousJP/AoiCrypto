import QrCodeScanner from "@/components/ZOldComponents/QrCodeScanner";
import { globalStyles } from "@/constants/GlobalStyle";
import SalaryAPI from "@/services/SalaryAPI";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native";

export default function Verifier() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [proof, setProof] = useState<string>("");
  const [publicSignal, setPublicSignal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Handle QR code data received from the scanner or image
  const handleQrCodeScanned = (data: string) => {
    console.log("Scanned QR Code:", data);
    try {
      const parsedData = JSON.parse(data);
      setQrData(data);
      setProof(JSON.stringify(parsedData.proof) || "");
      setPublicSignal(JSON.stringify(parsedData.publicSignals) || "");
      alert(`Scanned QR Code: ${data}`);
    } catch (error) {
      alert("Invalid QR code format");
    }
  };

  const handleVerify = async () => {
    if (!qrData) {
      Alert.alert("Error", "QR data is null or invalid.");
      return;
    }
    const requestData = JSON.parse(qrData);

    setLoading(true);
    try {
      console.log("Request Data: ", requestData);
      const response = await SalaryAPI.verifyProof(requestData);
      console.log(response.data);
      if (response.data.error) {
        Alert.alert("Verification Failed", response.data.message);
      } else {
        Alert.alert(
          "Verification Successful",
          JSON.stringify(response.data.data, null, 2)
        );
      }
    } catch (error) {
      console.error("Error verifying proof:", error);
      Alert.alert(
        "Verification Error",
        "An error occurred while verifying the proof."
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView className="mt-10 mx-6 bg-gray-50 p-6 rounded-xl flex flex-col h-full">
      <View className="flex flex-col gap-1 mb-4">
        <Text style={globalStyles.fontNormal} className="text-sm">
          Proof
        </Text>
        <TextInput
          style={globalStyles.fontNormal}
          className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
          placeholder="Proof"
          editable={false}
          value={proof}
        />
      </View>
      <View className="flex flex-col gap-1 mb-4">
        <Text style={globalStyles.fontNormal} className="text-sm">
          Public Signal
        </Text>
        <TextInput
          style={globalStyles.fontNormal}
          className="bg-white p-2 text-sm border-2 border-gray-100 rounded-lg"
          editable={false}
          placeholder="Public Signal"
          value={publicSignal}
        />
      </View>
      <QrCodeScanner onQrCodeScanned={handleQrCodeScanned} />
      <TouchableOpacity
        className="mt-4 p-4 bg-blue-500 rounded-lg"
        onPress={handleVerify}
        disabled={loading} // Disable button while loading
      >
        <Text
          style={globalStyles.fontBold}
          className="text-white font-bold text-center"
        >
          Verify
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff" // Customize the color as needed
          style={{ marginTop: 20 }} // Add some margin if necessary
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});

export interface VerifyRequest {
  proof: object;
  publicSignals: object;
}

export interface VerifyResponse {
  error: boolean;
  message: string;
  data?: {
    name: string;
    identifier: string;
    root: string;
    lower: number;
    upper: number;
  };
}
