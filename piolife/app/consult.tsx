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
const consult = require("../assets/images/image 48-2.png");

const Consult = () => {
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
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <View className="flex flex-col gap-[8px]">
          <View className="flex items-center flex-col gap-[8px]">
            <Image source={consult} className="w-[125px] h-[88px]" />
            <Text
              className="text-[#272757] text-[18px] leading-[20px]  "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Offices
            </Text>
          </View>
          <View className="flex flex-wrap flex-row justify-between mt-4">
            {buttons.map((button, index) => (
              <Pressable
                onPress={() => router.push(button.link)}
                key={button.id}
                className={`w-[48%] py-[16px]  rounded-lg items-center relative overflow-hidden ${
                  button.text === "Hospital" ||
                  button.text === "Emergency" ||
                  button.text === "Real Estate"
                    ? "bg-[#0e16ff]"
                    : "bg-[#ffffff]"
                } ${index < buttons.length - 2 ? "mb-4" : ""}`}
              >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-10 rounded-lg" />
                <Text
                  className={` text-[16px] leading-[24px] ${
                    button.text === "Hospital" ||
                    button.text === "Emergency" ||
                    button.text === "Real Estate"
                      ? "text-[#ffffff]"
                      : "text-[#272757]"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {button.text}
                </Text>
              </Pressable>
            ))}
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
  },
});
export default Consult;
