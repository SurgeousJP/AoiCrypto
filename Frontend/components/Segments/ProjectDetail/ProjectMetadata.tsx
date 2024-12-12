import Input from "@/components/Inputs/Input/Input";
import TextAreaInput from "@/components/Inputs/Input/TextAreaInput";
import Container from "@/components/Layouts/Container";
import {
  useCreateProject,
  useGetProjectByAddress,
  useUpdateProject,
} from "@/hooks/useApiHook";
import { useUploadImage } from "@/hooks/useUploadImage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";

interface IProjectMetadataSegmentProps {
  poolAddress: string;
}

const ProjectMetadataSegment = ({
  poolAddress,
}: IProjectMetadataSegmentProps) => {
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<any>(null); // Image as a file
  const [imageBannerUrl, setImageBannerUrl] = useState("");
  const [isExistingProject, setIsExistingProject] = useState(false);

  const { data: poolDetails, isLoading } = useGetProjectByAddress(poolAddress);
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const uploadImageMutation = useUploadImage();

  useEffect(() => {
    if (poolDetails) {
      setIsExistingProject(true);
      setName(poolDetails.name || "");
      setOverview(poolDetails.overview || "");
      setDescription(poolDetails.description || "");
      setImageBannerUrl(poolDetails.imageBannerUrl || "");
    }
  }, [poolDetails]);

  const handleUploadImage = async () => {
    if (!imageFile) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    uploadImageMutation.mutate(
      {
        image: {
          uri: imageFile.uri,
          name: imageFile.name,
          type: imageFile.type,
        },
        name: "project-banner",
        expiration: 3600,
      },
      {
        onSuccess: (data) => {
          setImageBannerUrl(data.data.url);
          Alert.alert("Success", "Image uploaded successfully.");
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to upload image.");
          console.error(error);
        },
      }
    );
  };

  const handleImageSelection = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Allow access to the photo library.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false, // You can change this to true if you need base64 encoding
    });

    console.log(pickerResult);

    if (!pickerResult.cancelled) {
      // Create a file object from the selected image
      const file = {
        uri: pickerResult.assets[0].uri,
        name: pickerResult.assets[0].uri.split("/").pop(),
        type: "image/jpeg", // You can adjust based on the image type
      };

      setImageFile(file);
    }
  };

  const handleSubmit = () => {
    const projectData = {
      name,
      overview,
      description,
      poolAddress,
      tokenAddress: "",
      imageBannerUrl,
    };

    if (isExistingProject) {
      updateProject(
        { id: poolDetails?.id, ...projectData },
        {
          onSuccess: () => {
            console.log("Project updated successfully");
          },
          onError: (error) => {
            console.error("Error updating project:", error.message);
          },
        }
      );
    } else {
      createProject(projectData, {
        onSuccess: () => {
          console.log("Project created successfully");
        },
        onError: (error) => {
          console.error("Error creating project:", error.message);
        },
      });
    }
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
                value={name}
                type="text"
                onChange={(name, value) => setName(value)}
              />
            </View>
            <View className="mb-3">
              <Input
                label={"Overview"}
                name={"overview"}
                value={overview}
                type="text"
                onChange={(name, value) => setOverview(value)}
              />
            </View>
            <TextAreaInput
              title={"Description"}
              type={"text"}
              value={description}
              onChange={(name, value) => setDescription(value)}
              name={"description"}
              placeholder={""}
              isUnitVisible={false}
            />
          </View>

          <Button title="Select Image" onPress={handleImageSelection} />

          {imageFile && (
            <View>
              <Image
                source={{ uri: imageFile.uri }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
              <Button title="Upload Image" onPress={handleUploadImage} />
            </View>
          )}

          {imageBannerUrl && (
            <Text className="text-primary mt-2">
              Image uploaded: {imageBannerUrl}
            </Text>
          )}

          <Button title="Submit" onPress={handleSubmit} />
        </Container>
      </View>
    </ScrollView>
  );
};

export default ProjectMetadataSegment;
