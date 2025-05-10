import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { StateSelect } from "@/components/flatListItems/items";
const statesWithStatus = [
  { state: "Abuja", status: "available" },
  { state: "Abia", status: "available" },
  { state: "Adamawa", status: "unavailable" },
  { state: "Akwa Ibom", status: "available" },
  { state: "Anambra", status: "available" },
  { state: "Bauchi", status: "unavailable" },
  { state: "Bayelsa", status: "available" },
  { state: "Benue", status: "unavailable" },
  { state: "Borno", status: "unavailable" },
  { state: "Cross River", status: "available" },
  { state: "Delta", status: "available" },
  { state: "Ebonyi", status: "unavailable" },
  { state: "Edo", status: "available" },
  { state: "Ekiti", status: "unavailable" },
  { state: "Enugu", status: "available" },
  { state: "Gombe", status: "unavailable" },
  { state: "Imo", status: "available" },
  { state: "Jigawa", status: "unavailable" },
  { state: "Kaduna", status: "available" },
  { state: "Kano", status: "unavailable" },
  { state: "Katsina", status: "available" },
  { state: "Kebbi", status: "unavailable" },
  { state: "Kogi", status: "available" },
  { state: "Kwara", status: "available" },
  { state: "Lagos", status: "available" },
  { state: "Nasarawa", status: "unavailable" },
  { state: "Niger", status: "available" },
  { state: "Ogun", status: "available" },
  { state: "Ondo", status: "available" },
  { state: "Osun", status: "unavailable" },
  { state: "Oyo", status: "available" },
  { state: "Plateau", status: "unavailable" },
  { state: "Rivers", status: "available" },
  { state: "Sokoto", status: "unavailable" },
  { state: "Taraba", status: "available" },
  { state: "Yobe", status: "unavailable" },
  { state: "Zamfara", status: "unavailable" },
];

const SelectPlot = () => {
  const handlePrevious = () => {
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[24px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-2"
          onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px] leading-[20px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>
        <View className="flex flex-col gap-[24px]">
          <Text
            className="text-[#030319] text-[14px] leading-[100%]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Select any available state to view properties
          </Text>
          <FlatList
            data={statesWithStatus}
            renderItem={({ item }) => (
              <StateSelect
                item={item}
                onPress={() => router.push("/selectEstate")}
              />
            )}
            keyExtractor={(item) => item.state}
            numColumns={3}
            ListFooterComponent={<View style={{ height: 200 }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectPlot;
