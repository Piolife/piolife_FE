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
import { EstateSelect } from "@/components/flatListItems/items";
const statesWithStatus = [
  { state: "Abuja", status: "available" },
  { state: "Abia", status: "available" },
  { state: "Adamawa", status: "unavailable" },
  { state: "Akwa Ibom", status: "available" },
  { state: "Anambra", status: "available" },
  { state: "Bauchi", status: "unavailable" },
  { state: "Bayelsa", status: "available" },
];

const selectEstate = () => {
  const handlePrevious = () => {
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 20 : 0 }}
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={statesWithStatus}
            renderItem={EstateSelect}
            keyExtractor={(item) => item.state}
            numColumns={1}
            ListFooterComponent={<View style={{ height: 200 }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default selectEstate;
