//Import//
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import NoDocument from "@/components/Displays/NoDocument/NoDocument";
import Input from "@/components/Inputs/Input/Input";
import Row from "@/components/Items/Project/Row";
import Container from "@/components/Layouts/Container";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import ExcelFilePicker from "@/components/utility/ExcelFilePicker";
import { colors } from "@/constants/colors";
import {
  getDateFromUnixTimestamp,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { StateContext, StateContextType } from "@/contexts/StateProvider";
import {
  createEmptyPoolTime,
  PoolTime,
} from "@/contracts/types/IDO/CreateIDOInput";
import { showToast } from "@/utils/toast";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import

function createStepTwo() {
  const navigation = useNavigation();
  const router = useRouter();

  const [poolTime, setPoolTime] = useState<PoolTime>(createEmptyPoolTime());
  const [whitelistDisplayData, setWhitelistData] = useState<any[]>([]);

  const { createIDO, updateCreateIDO } = useContext(
    StateContext
  ) as StateContextType;

  useEffect(() => {
    updateCreateIDO("poolTime", poolTime);
  }, [poolTime]);

  const onDateTimeInputChange = (name: string, value: any) => {
    setPoolTime({
      ...poolTime,
      [name]: BigInt(getUnixTimestampFromDate(value)),
    });
  };

  const onLoadWhitelist = (jsonData: any[]) => {
    const formattedData = jsonData.map((item) =>
      Object.keys(item).map((key) => ({
        value: item[key],
        style: styles[key],
      }))
    );
    setWhitelistData(formattedData);
  };

  const styles = {
    "Wallet Address": "font-readexRegular text-sm",
    Allocation: "font-readexRegular text-sm",
    Remarks: "font-readexRegular text-sm text-error",
  };

  const onNavigatingBack = () => {
    // router.back();
    router.navigate("/project/createStepOne");
  };

  const onNavigateToStepThree = () => {
    // if (isStepTwoInputValid()) {
    //   router.push("/project/createStepThree");
    // }
    router.push("/project/createStepThree");
  };

  const isStepTwoInputValid = () => {
    const currentDateUnixTimeStamp = getUnixTimestampFromDate(new Date());
    if (poolTime.startTime < currentDateUnixTimeStamp) {
      showInvalidInputToast("Start time must be from now");
      return false;
    }
    if (poolTime.endTime < currentDateUnixTimeStamp) {
      showInvalidInputToast("End time must be in the future");
      return false;
    }
    if (
      createIDO.privateSale &&
      poolTime.startPublicSale <= currentDateUnixTimeStamp
    ) {
      showInvalidInputToast("Start time must be in the future");
      return false;
    }

    return true;
  };

  const showInvalidInputToast = (message: string) => {
    showToast("error", "Invalid Input", message);
  };

  return (
    <ScrollView className="flex-1  bg-background">
      <ScreenHeader
        LeftComponent={
          <TouchableOpacity onPress={onNavigatingBack} className="p-2">
            <Back stroke={colors.secondary} width={24} height={24} />
          </TouchableOpacity>
        }
        CenterComponent={
          <View className="w-[240px] h-[24px] mb-2">
            <StepIndicatorComponent
              mode={"horizontal"}
              labels={["", "", ""]}
              currentPosition={1}
            />
          </View>
        }
        RightComponent={<Back stroke={"#ffffff"} width={24} height={24} />}
      />

      <View className="flex flex-col p-4">
        <View className="mt-2">
          <Container>
            <View
              className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
              <Text className="font-readexBold text-md text-primary mb-2">
                Sale Configuration
              </Text>
              <View className="mb-3">
                <Input
                  label={"Start time"}
                  type="datetime"
                  value={getDateFromUnixTimestamp(poolTime.startTime)}
                  name="startTime"
                  onChange={onDateTimeInputChange}
                />
              </View>
              <View className="mb-3">
                <Input
                  label={"End time"}
                  type="datetime"
                  value={getDateFromUnixTimestamp(poolTime.endTime)}
                  name="endTime"
                  onChange={onDateTimeInputChange}
                />
              </View>
              {createIDO.privateSale && (
                <View className="mb-3">
                  <Input
                    label={"Start public sale time"}
                    type="datetime"
                    value={getDateFromUnixTimestamp(poolTime.startPublicSale)}
                    name="startPublicSale"
                    onChange={onDateTimeInputChange}
                  />
                </View>
              )}
            </View>
          </Container>
        </View>

        {createIDO.privateSale && (
          <View className="mt-4">
            <Container>
              <View
                className="bg-surface rounded-lg px-4 py-2 flex flex-col border-border border-[0.5px]"
                style={{ elevation: 2 }}
              >
                <Text className="font-readexBold text-md text-primary mb-2">
                  Whitelist Upload
                </Text>
                <Pressable>
                  <ExcelFilePicker onFileLoadedSuccess={onLoadWhitelist} />
                </Pressable>

                {whitelistDisplayData && whitelistDisplayData.length > 0 ? (
                  <FlatList
                    style={{
                      paddingHorizontal: 0,
                      borderColor: colors.border,
                      borderWidth: 0.5,
                      elevation: 1,
                      marginTop: 12,
                      marginBottom: 5,
                    }}
                    contentContainerStyle={{ flexGrow: 1, gap: 0 }}
                    scrollEnabled={false}
                    data={whitelistDisplayData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item) => {
                      return <Row key={Math.random()} contents={item.item} />;
                    }}
                  />
                ) : (
                  <View className="mb-2">
                    <NoDocument
                      heading="No whitelist users"
                      detail="Try to import whitelist users by clicking at the button above"
                    />
                  </View>
                )}
              </View>
            </Container>
          </View>
        )}

        <View className="mt-4 flex-row justify-between">
          <View className="w-[48%]">
            <PrimaryButton content={"Back"} onPress={onNavigatingBack} />
          </View>
          <View className="w-[48%]">
            <PrimaryButton
              content={"Next step"}
              onPress={onNavigateToStepThree}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default createStepTwo;
