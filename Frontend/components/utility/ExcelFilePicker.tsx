import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
// Enable logging: npx react-native log-android

interface Props{
  onFileLoadedSuccess: (rows: any[]) => void;
}

const ExcelFilePicker:React.FC<Props> = (props) => {
  const excelXlsxMIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  const [fileData, setFileData] = useState(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      copyToCacheDirectory: true,
    });

    const data = result.assets !== null ? result.assets[0] : null;
    if (data !== null) {
      console.log(data);
      if (data.mimeType !== undefined && data.mimeType === excelXlsxMIME) {
        setUri(data.uri);
        setFileName(data.name);
        setFileType(data.mimeType);
        
      const fileContent = await FileSystem.readAsStringAsync(data.uri, {
        encoding: FileSystem.EncodingType.Base64, // Read as base64
      });

      // Parse the Excel file
      const workbook = XLSX.read(fileContent, { type: "base64" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // console.log("Excel Data:", jsonData);

      props.onFileLoadedSuccess(jsonData);

      } else {
        Alert.alert(
          `Wrong file type", "The import file must be a ${data.mimeType} file !`
        );
      }
    } else {
      setFileName(undefined);
      setFileType("");
    }
  };

  return (
    <View className="w-full">
      <PrimaryButton
        content="Upload private sale spreadsheet"
        onPress={handleFilePick}
      />
      {/* {fileName && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileText}>File Name: {fileName}</Text>
          <Text style={styles.fileText}>File Type: {fileType}</Text>
        </View>
      )} */}
    </View>
  );
};
export default ExcelFilePicker;
