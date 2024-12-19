import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import LoadingModal from "@/components/Displays/Modal/LoadingModal";
import NoImage from "@/components/Displays/Results/NoImage/NoImage";
import ScreenLoadingIndicator from "@/components/Displays/ScreenLoadingIndicator/ScreenLoadingIndicator";
import Input from "@/components/Inputs/Input/Input";
import TextAreaInput from "@/components/Inputs/Input/TextAreaInput";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/colors";
import {
  useCreateProject,
  useGetProjectByAddress,
  useUpdateProject,
} from "@/hooks/useApiHook";
import { useUploadImage } from "@/hooks/useUploadImage";
import { Project } from "@/model/ApiModel";
import { showToast } from "@/utils/toast";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

interface Props {
  poolAddress: string;
}

const ProjectMetadataSegment: React.FC<Props> = ({ poolAddress }) => {
  const [metadata, setMetadata] = useState<Project | undefined>(undefined);
  const [isExistingProject, setIsExistingProject] = useState(false);

  const { data: poolDetails, isLoading } = useGetProjectByAddress(poolAddress);
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const uploadImageMutation = useUploadImage();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && poolDetails !== null) {
      setMetadata(poolDetails);
      setIsExistingProject(true);
      return;
    }
    if (!isLoading && poolDetails === null) {
      setMetadata({
        id: "",
        poolAddress: poolAddress,
        tokenAddress: "",
        name: "",
        overview: "",
        description: "",
        imageBannerUrl: "",
      });
    }
  }, [isLoading, poolDetails]);

  const onInputChange = (name: any, value: any) => {
    setMetadata({ ...metadata, [name]: value });
  };

  const handleUploadImage = async (imageFile: any) => {
    if (!imageFile) {
      showToast("error", "Invalid input", "Please select an image first");
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
          setMetadata({ ...metadata, ["imageBannerUrl"]: data.data.url });
          showToast("success", "Image uploaded successfully", "");
        },
        onError: (error) => {
          showToast("error", "Failed to upload image", error.message);
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

      await handleUploadImage(file);
    }
  };

  const handleSubmit = () => {
    if (metadata === undefined) {
      showToast("error", "Invalid input", "Project input is undefined");
      return;
    }

    setModalVisible(true);

    const projectData = {
      name: metadata.name,
      overview: metadata.overview,
      description: metadata.description,
      poolAddress: metadata.poolAddress,
      tokenAddress: metadata.tokenAddress,
      imageBannerUrl: metadata.imageBannerUrl,
    };

    if (isExistingProject) {
      updateProject(
        { id: poolDetails?.id, ...projectData },
        {
          onSuccess: () => {
            showToast(
              "success",
              "Request success",
              "Updated project successfully"
            );
            setModalVisible(false);
          },
          onError: (error) => {
            showToast("error", "Error updating project", error.message);
            setModalVisible(false);
          },
        }
      );
    } else {
      createProject(projectData, {
        onSuccess: () => {
          showToast(
            "success",
            "Request success",
            "Created project successfully"
          );
          setModalVisible(false);
        },
        onError: (error) => {
          showToast("error", "Error creating project", error.message);
          setModalVisible(false);
        },
      });
    }
  };

  console.log("Pool id: ", poolAddress);
  console.log("Image banner url:", metadata?.imageBannerUrl);
  console.log("Is loading: ", isLoading);
  console.log("Metadata:", metadata);

  if (!(!isLoading && metadata !== undefined && metadata !== null))
    return <ScreenLoadingIndicator />;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2"
    >
      <LoadingModal isVisible={modalVisible} task={"Configuring request"} />
      <View>
        <Container>
          <View
            className="bg-surface px-4 py-2 flex flex-col border-border border-[0.5px]"
            style={{ elevation: 2 }}
          >
            <Text className="font-readexBold text-md text-primary mb-2">
              Project Information
            </Text>
            <View className="mb-3">
              <Text className="font-readexSemiBold text-sm mb-1">
                Project banner
              </Text>
              <PrimaryButton
                content="Select image"
                onPress={handleImageSelection}
              />
              {metadata.imageBannerUrl !== "" ? (
                <View>
                  <Image
                    source={{
                      uri: metadata.imageBannerUrl,
                    }}
                    style={{
                      width: "100%",
                      aspectRatio: 3 / 2,
                      marginTop: 10,
                    }}
                  />
                </View>
              ) : (
                <View className="mb-3">
                  <NoImage />
                </View>
              )}
            </View>
            <View className="mb-3">
              <Input
                label={"Project name"}
                name={"name"}
                value={metadata.name}
                type="text"
                onChange={onInputChange}
                initialValue={metadata.name}
              />
            </View>
            <View className="mb-3">
              <Input
                label={"Overview"}
                name={"overview"}
                value={metadata.overview}
                type="text"
                onChange={onInputChange}
                initialValue={metadata.overview}
              />
            </View>
            <TextAreaInput
              title={"Description"}
              name={"description"}
              type={"text"}
              value={metadata.description}
              onChange={onInputChange}
              placeholder={""}
              isUnitVisible={false}
              initialValue={metadata.description}
            />
            <View className="mt-3 mb-1">
              <PrimaryButton content="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default ProjectMetadataSegment;
