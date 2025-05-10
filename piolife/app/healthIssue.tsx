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
import { useFetchData, useGetData } from "@/services/api/request";
import { HealthIssueType } from "@/services/core/types";

const HealthIssue = () => {
  const handlePrevious = () => {
    router.back();
  };

  const {
    data: newdata,
    loading: isloading,
    error: iserror,
  } = useFetchData<any>(
    `https://piolife-be.onrender.com/api/v12/medical-issues`
  );

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  const isDisabled = !Object.values(selectedItems).some((value) => value);

  const handleNext = () => {
    const selectedArray = newdata?.filter(
      (item: HealthIssueType) => selectedItems[item._id]
    );
    const encoded = encodeURIComponent(JSON.stringify(selectedArray));
    router.push(`/pay4Consultation?selected=${encoded}`);
  };
  const toggleSelect = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  if (isloading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  if (newdata) {
    console.log("data", newdata);
  }
  if (iserror) {
    console.log("error", iserror);
  }
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex-1 flex flex-col justify-between px-[4%]">
        <View className="py-[16px]  gap-[24px]">
          <Pressable
            className="flex flex-row items-center gap-[16px] mt-2"
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
          <View className="flex flex-col gap-[24px]">
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
              <View>
                <Text
                  className="text-[#424242] text-[14px] leading-[17px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  NB: A single health issue selected is equivalent to
                </Text>
                <View className="flex flex-row items-center gap-[4px]">
                  <Image source={piocoin} className="h-[33px] w-[16px]" />
                  <Text
                    className="text-[#424242] text-[14px] leading-[17px]"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    1500
                  </Text>
                </View>
              </View>
            </View>
            <View className="py-[4px] flex flex-row justify-between">
              <Text
                className="text-[#030319] text-[14px] leading-[150%]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                ({selectedCount} Selected)
              </Text>
              <Text
                className="text-[#424242] text-[14px] leading-[150%]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Total: {selectedCount * 1500}
              </Text>
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
              justifyContent: "space-between", // Push columns to both ends
              marginHorizontal: 10, // Space between columns
              columnGap: 12,
            }}
            // ListFooterComponent={<View style={{ height: 200 }} />}
          />
        </View>
        <Pressable
          disabled={isDisabled}
          className={`px-[32px] h-[56px] ${
            isDisabled ? "bg-[#aaaaaa]" : "bg-[#0e16ff]"
          } rounded-[8px] flex items-center justify-center mb-[12px]`}
          onPress={handleNext}
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Next
          </Text>
        </Pressable>
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
