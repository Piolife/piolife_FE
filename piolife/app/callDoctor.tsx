import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const doctor = require("../assets/images/Mask Group-2.png");
const CallDoctor = () => {
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
            className="text-[#000000] text-[16px] leading-[24px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            General Practice
          </Text>
          <View className="py-[4px] flex flex-col gap-[16px]">
            <Pressable
              className="border-[#DADADA80] border-[1px] p-[16px] rounded-[4px] bg-[#fffff0]"
              style={[styles.shadowProp]}
            >
              <View className=" flex flex-row gap-[16px] items-center ">
                <Image source={doctor} className="h-[80px] w-[80px]" />
                <View className="flex flex-col gap-[8px] flex-1">
                  <View className=" border-[#dadada80] border-b pb-2 flex w-full">
                    <Text
                      className="text-[#272757] text-[14px] leading-[20px]  "
                      style={{ fontFamily: "Inter_600SemiBold" }}
                    >
                      Dr 234789DH
                    </Text>
                  </View>
                  <Text
                    className="text-[#272757] text-[12px] leading-[20px]  "
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    Register
                  </Text>
                </View>
              </View>
              <View className="flex items-end">
                <View className="py-[10px] border-[#dadada] border-[1px] rounded-[8px] px-[16px] gap-[16px] flex flex-row">
                  <Pressable className="p-[8px] rounded-full bg-[##0E16FF] ">
                    <Feather name="phone" size={16} color="white" />
                  </Pressable>
                  <View className="w-[1px] bg-[#DADADA80]"></View>
                  <Pressable className="p-[8px] rounded-full bg-[##0E16FF] ">
                    <Feather name="video" size={16} color="white" />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
export default CallDoctor;
