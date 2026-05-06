import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { router } from "expo-router";
import { SelectSickness } from "@/components/flatListItems/items";
import { useFetchData } from "@/services/api/request";
import { HealthIssueType } from "@/services/core/types";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";

const HealthIssue = () => {
  const [selectedId, setSelectedId] = useState<string>("English");
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "English",
        label: "English",
        value: "English",
      },
      {
        id: "Yoruba",
        label: "Yoruba",
        value: "Yoruba",
      },
      {
        id: "Igbo",
        label: "Igbo",
        value: "igbo",
      },
      {
        id: "Hausa",
        label: "Hausa",
        value: "Hausa",
      },
    ],
    []
  );
  const handlePrevious = () => {
    router.back();
  };

  const {
    data: newdata,
    loading: isloading,
    error: iserror,
  } = useFetchData<any>(`${API_URL}/api/v12/medical-issues`);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  const isDisabled = !Object.values(selectedItems).some((value) => value);
  const selectedIds = Object.keys(selectedItems).filter(
    (id) => selectedItems[id]
  );
  const selectedCount = selectedIds.length;

  const totalCost = selectedIds.reduce((sum, id) => {
    const item = newdata.find((item: any) => item._id === id);
    return item ? sum + item.price : sum;
  }, 0);
  console.log("data", newdata);
  const handleNext = () => {
    const selectedArray = newdata?.filter(
      (item: HealthIssueType) => selectedItems[item._id]
    );
    const encoded = encodeURIComponent(JSON.stringify(selectedArray));
    router.push(
      `/pay4Consultation?selected=${encoded}&selectedId=${selectedId}&cost=${totalCost}`
    );
  };
  const toggleSelect = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  if (isloading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex-1 flex flex-col justify-between px-[4%] pt-12">
        <View className="py-[16px]  gap-[24px]">
          <Pressable
            className="flex flex-row items-center gap-[16px] "
            onPress={handlePrevious}
          >
            <FontAwesome name="angle-left" size={24} color="black" />
            <Text
              className="text-[#272757] text-[16px] leading-[20px] text-center"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Back
            </Text>
          </Pressable>
          <View className="flex flex-col gap-[16px]">
            <View className="py-[4px] flex flex-col gap-[16px]">
              <Text
                className="text-[#030319] text-[16px] leading-[24px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                  Click to select health issue
                </Text>
                (select multiple)
              </Text>
            </View>
            <View className="flex flex-col gap-[16px]">
              <Text
                className="text-[#030319] text-[16px] leading-[24px]"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Preferred Language (select just one)
              </Text>
              <RadioGroup
                layout="column"
                containerStyle={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  gridRowGap: "16px",
                  rowGap: "16px",
                }}
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
              />
            </View>
            <View className="py-[4px] flex flex-row justify-between">
              <Text
                className="text-[#030319] text-[14px] leading-[150%]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                ({selectedCount} Selected)
              </Text>
              <View className="flex flex-row items-center gap-2 ">
                <Image source={piocoin} style={{ width: 10, height: 20 }} />
                <Text
                  className="text-[#424242] text-[14px] leading-[150%]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  {formatNumberToThousands(totalCost)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-1 mb-4">
          <FlatList
            data={newdata}
            renderItem={({ item }) => (
              <SelectSickness
                item={item}
                selected={!!(item._id && selectedItems[item._id])}
                onPress={() => item._id && toggleSelect(item._id)}
              />
            )}
            keyExtractor={(item) => item.state}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginHorizontal: 10,
              columnGap: 12,
            }}
            ListFooterComponent={
              <Pressable
                disabled={isDisabled}
                className={`px-[32px] h-[56px] ${
                  isDisabled ? "bg-[#aaaaaa]" : "bg-[#0e16ff]"
                } rounded-[8px] flex items-center justify-center mt-[12px]`}
                onPress={handleNext}
              >
                <Text
                  className="text-white text-[16px]"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  Next
                </Text>
              </Pressable>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  text: {
    fontSize: 25,
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HealthIssue;
