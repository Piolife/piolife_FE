import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const EmergencyMenu = () => {
  const handlePrevious = () => {
    router.back();
  };

  const error = require("../assets/images/error.png");
  const ambulance = require("../assets/images/15-2.png");
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
        <View className="flex flex-col gap-[32px]">
          <Text
            className="text-[#030319] text-[16px] leading-[24px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Emergency Services
          </Text>
          <View className="p-[16px] bg-[#F0F8FF66] rounded-[8px] flex flex-row items-center gap-[16px]">
            <Image source={error} className="w-[24px] h-[24px]" />
            <Text
              className="text-[#424242] text-[12px] leading-[17px]"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              You will charged automatically from your wallet
            </Text>
          </View>
          <View className="flex items-center">
            <Image source={ambulance} className="w-[150px] h-[149px]" />
          </View>
          <Pressable
            onPress={() => {
              router.push("/emergencyDetails");
            }}
            className={`px-[32px] h-[56px] bg-[#0e16ff]  rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Request Ambulance Services
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmergencyMenu;
