import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";
const user = require("../assets/images/image 42-2.png");
const provider = require("../assets/images/User Account.png");

const SelectProfile = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <Text
          className="text-[#272757] text-[18px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Your Profile
        </Text>
        <Text
          className="text-[#272757] text-[14px] leading-[17px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Kindly select how you want to sign in
        </Text>
        <View className="flex flex-col gap-[24px]">
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            onPress={() => {
              router.push("/clientSignup");
            }}
            style={[styles.shadowProp]}
          >
            <Image source={user} className="h-[40px] w-[40px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Service User (Client)
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Register to consult with our professionals.
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80]  border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            style={[styles.shadowProp]}
            onPress={() => {
              router.push("/(tabs)");
            }}
          >
            <Image source={provider} className="h-[40px] w-[40px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Service Provider (Consultant)
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Register to consult for us
              </Text>
            </View>
          </Pressable>
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
export default SelectProfile;
