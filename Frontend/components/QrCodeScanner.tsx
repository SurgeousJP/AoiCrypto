import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

interface QrCodeScannerProps {
  onQrCodeScanned: (data: string) => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onQrCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Request camera permissions
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Handle scanned QR code from live camera
  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    onQrCodeScanned(data);
    setCameraVisible(false); // Hide camera after scanning
  };

  // Pick image from gallery and scan for QR code
  const pickImageAndScan = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
      const qrData = await scanQrFromImage(result.assets[0].uri);
      if (qrData) {
        onQrCodeScanned(qrData);
        Alert.alert("QR Code Found", qrData);
      } else {
        Alert.alert("No QR Code found", "Try a different image.");
      }
    }
  };

  // Scan QR code from the selected image
  const scanQrFromImage = async (uri: string) => {
    try {
      console.log(uri);
      const scannedResults = await Camera.scanFromURLAsync(uri);
      return scannedResults[0].data;
    } catch (error) {
      return "No QR Code Found";
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Button to open camera */}
      <Pressable
        className="rounded-md w-full"
        onPress={() => setCameraVisible(true)}
      >
        <Text className="text-white font-bold mt-6 p-4 w-full h-fit bg-blue-500 self-center justify-center text-center align-middle rounded-lg">
          Open Camera to Scan QR Code
        </Text>
      </Pressable>

      {/* Button to pick image from gallery */}
      <Pressable className="rounded-md w-full" onPress={pickImageAndScan}>
        <Text className="text-white font-bold mt-6 p-4 w-full h-fit bg-blue-500 self-center justify-center text-center align-middle rounded-lg">
          Pick image to scan QR Code
        </Text>
      </Pressable>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Camera View */}
      {cameraVisible && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 400,
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default QrCodeScanner;
