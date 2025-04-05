import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
const doctor = require("../assets/images/First Aid-2.png");
const insurance = require("../assets/images/Medical Icons.png");
const ambulance = require("../assets/images/15.png");
const realtor = require("../assets/images/User-2.png");

const SelectConsultant = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[24px] gap-[32px]">
        <Text
          className="text-[#272757] text-[18px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Consultant
        </Text>
        <Text
          className="text-[#272757] text-[14px] leading-[17px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Select the services you’ll be providing
        </Text>
        <View className="flex flex-col gap-[24px]">
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            onPress={() => {
              router.push("/doctorSignup");
            }}
            style={[styles.shadowProp]}
          >
            <Image source={doctor} className="h-[40px] w-[40px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Medical Practitioner
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                For medical doctors of all specialty
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            style={[styles.shadowProp]}
            onPress={() => {
              router.push("/emergencySignup");
            }}
          >
            <Image source={ambulance} className="h-[40px] w-[40px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Emergency Services (Ambulance)
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                First response providers
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            style={[styles.shadowProp]}
          >
            <Image source={realtor} className="h-[40px] w-[40px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Real Estate Services
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Professional Realtors
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-[#fffff0]"
            style={[styles.shadowProp]}
            onPress={() => {
              router.push("/selectConsultant");
            }}
          >
            <Image source={insurance} className="h-[40.36px] w-[32px]" />
            <View className="flex flex-col gap-[8px]">
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Insurance Services
              </Text>
              <Text
                className="text-[#272757] text-[12px] leading-[20px]  "
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Health and life insurance
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
  },
});
export default SelectConsultant;
