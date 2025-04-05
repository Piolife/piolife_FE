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

const error = require("../assets/images/error.png");
const AvailableConsultant = () => {
  const handlePrevious = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
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
            className="text-[#000000] text-[14px] leading-[150%]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Click specialty to speak with the available consultants now
          </Text>
          <View className="rounded-[8px] p-[16px] gap-[16px] flex flex-row bg-[#F0F8FF66] items-center">
            <Image source={error} className="w-[24px] h-[24px]" />
            <Text
              className="text-[#000000] text-[10px] leading-[100%] flex-1"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Do not disclose your mobile number, email, or residential address
              to the consultant. Piolife will not be held reponsible for any
              eventuality resulting from sharing your personal data to the
              consultant.
            </Text>
          </View>
          <View>
            <Pressable
              className="rounded-[4px] border-[#DADADA80] border-[1px]  flex flex-row gap-[16px] items-center bg-[#fffff0]"
              onPress={() => {
                router.push("/clientSignup");
              }}
              style={[styles.shadowProp]}
            >
              <View className="flex flex-col gap-[8px] flex-1">
                <View className="flex items-end">
                  <View className="py-[4px] px-[16px] rounded-bl-[8px] bg-[#4CB050]">
                    <Text
                      className="text-[#ffffff] text-[12px] leading-[150%]  "
                      style={{ fontFamily: "Inter_500Medium" }}
                    >
                      Available
                    </Text>
                  </View>
                </View>
                <View className="flex flex-col gap-[8px] px-[16px] pb-[16px]">
                  <View className=" border-[#dadada80] border-b pb-2 flex w-full">
                    <Text
                      className="text-[#030319] text-[14px]   "
                      style={{ fontFamily: "Inter_500Medium" }}
                    >
                      General Practice
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-[4px]">
                    <View className="w-[4px] h-[4px] bg-[#424242] rounded-full"></View>
                    <Text
                      className="text-[#272757] text-[12px] leading-[20px]  "
                      style={{ fontFamily: "Inter_400Regular" }}
                    >
                      Register
                    </Text>
                  </View>
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
export default AvailableConsultant;
