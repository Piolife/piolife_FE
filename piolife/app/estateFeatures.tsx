import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  FlatList,
  ImageBackground,
  ScrollView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { EstateSelect, Features } from "@/components/flatListItems/items";
const statesWithStatus = [
  "Tarred Road",
  "Security",
  "Hospital",
  "Supermarket",
  "Recreation Center",
  "School",
  "Street Light",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
  "available",
];

const estateFeatures = () => {
  const handlePrevious = () => {
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex-1 py-[16px] gap-[24px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-2 px-[4%]"
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

        <View className="flex-1">
          <View className="flex flex-col gap-[16px]">
            <ImageBackground
              source={require("../assets/images/image.png")}
              className="h-[200px] flex justify-end items-end px-[4%] py-[16px]"
            >
              <Pressable className="px-[16px] h-[37px] bg-[#0e16ff] rounded-[8px] flex items-center justify-center">
                <Text
                  className="text-white text-[12px]"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  Landscape view
                </Text>
              </Pressable>
            </ImageBackground>

            <View className="flex flex-col gap-[8px] px-[4%]">
              <Text
                className="text-[#272757] text-[16px]"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Woodland Estate
              </Text>
              <View className="flex flex-row gap-[3px] items-center">
                <EvilIcons name="location" size={16} color="black" />
                <Text
                  className="text-[#030319] text-[14px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  1012 Ocean avanue, Benin city, Edo state
                </Text>
              </View>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <View className="px-[4%]">
              {statesWithStatus.map((item, index) => (
                <Features key={index} item={item} />
              ))}
            </View>
          </ScrollView>

          <View className="absolute bottom-4 w-full items-center">
            <Pressable className="px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center">
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Download survey
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default estateFeatures;
