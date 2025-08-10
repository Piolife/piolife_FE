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
import { FontAwesome } from "@expo/vector-icons";
const doctor = require("../assets/images/edrtff.png");
const ambulance = require("../assets/images/15.png");
const elderly = require("../assets/images/dtterv.png");

const HospitalOptions = () => {
  const handlePrevious = () => {
    router.back();
  };
  type ButtonType = {
    id: number;
    text: string;
    link?: any;
  };
  const buttons: ButtonType[] = [
    { id: 1, text: "Hospital", link: "/hospitalOptions" },
    { id: 2, text: "Emergency", link: "/emergencyMenu" },
    { id: 3, text: "Real Estate", link: "/realEstate" },
    { id: 4, text: "Flight Booking", link: "/hospitalOptions" },
    { id: 5, text: "E-Commerce", link: "/hospitalOptions" },
    { id: 6, text: "Hotel Booking", link: "/hospitalOptions" },
    { id: 7, text: "Insurance", link: "/hospitalOptions" },
    { id: 8, text: "Entertainment", link: "/hospitalOptions" },
    { id: 9, text: "Transport", link: "/hospitalOptions" },
    { id: 10, text: "Chambers", link: "/hospitalOptions" },
    { id: 11, text: "Media House", link: "/hospitalOptions" },
    { id: 12, text: "Government", link: "/hospitalOptions" },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[24px] pt-16">
        <Pressable
          className="flex flex-row items-center gap-[16px] "
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
        <View className="flex flex-col gap-[16px]">
          <Text
            className="text-[#272757] text-[16px] leading-[24px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Hello and welcome
          </Text>
          <Text
            className="text-[#424242] text-[14px] leading-[17px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            How can we be of help today?
          </Text>
        </View>
        <View className="flex flex-col gap-[24px]">
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row justify-between items-center bg-[#fffff0]"
            onPress={() => {
              router.push("/healthIssue");
            }}
            style={[styles.shadowProp]}
          >
            <View className="flex flex-row gap-[16px] items-center">
              <Image source={doctor} className="h-[40px] w-[40px]" />
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Talk to a doctor
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Consult a specialist today
                </Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row justify-between items-center bg-[#fffff0]"
            onPress={() => {
              router.push("/emergencyMenu");
            }}
            style={[styles.shadowProp]}
          >
            <View className="flex flex-row gap-[16px] items-center">
              <Image source={ambulance} className="h-[40px] w-[40px]" />
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Emergency Services
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  24/7 ambulance services
                </Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
          </Pressable>
          <Pressable
            className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row justify-between items-center bg-[#fffff0]"
            style={[styles.shadowProp]}
          >
            <View className="flex flex-row gap-[16px] items-center">
              <Image source={elderly} className="h-[40px] w-[40px]" />
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Care for the elderly
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Get a professional for your loved ones
                </Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
          </Pressable>
        </View>
        {/* <View className="flex flex-col gap-[16px]">
          <View className="flex flex-row justify-between py-[4px] px-[8px] items-center">
            <Text
              className="text-[#272757] text-[16px] leading-[20px]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Medical History
            </Text>
            <Text
              className="text-[#0E16FF] text-[14px] leading-[20px]"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              See more
            </Text>
          </View>
          <View className="flex flex-col gap-[16px]">
            <Pressable
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row justify-between items-center bg-[#fffff0]"
              onPress={() => {
                router.push("/doctorSignup");
              }}
              style={[styles.shadowProp]}
            >
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Doctor’s Reports
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Dr Mark left a medical report after your call session.
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row justify-between items-center bg-[#fffff0]"
              onPress={() => {
                router.push("/doctorSignup");
              }}
              style={[styles.shadowProp]}
            >
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Prescribed Drug, Pricing and Delivery
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Check out your prescription from Dr Mark
                </Text>
              </View>
            </Pressable>
          </View>
        </View> */}
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
export default HospitalOptions;
