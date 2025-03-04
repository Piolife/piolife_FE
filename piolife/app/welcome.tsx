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
const logo = require("../assets/images/splash-icon.png");
import { router } from "expo-router";
const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="h-[30vh] flex items-center justify-center">
        <Image source={logo} className="w-[104px] h-[78px]" />
      </View>

      <View className="h-[70vh] bg-[#0e16ff] flex-col  flex px-1">
        <View>
          <View className="gap-[16px] px-[16px] flex ">
            <Text
              className="text-white text-[20px] leading-[24px] text-center mt-8"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Welcome to the hub of
            </Text>
            <Text
              className="text-white text-[24px] leading-[24px] text-center"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              E-consultation & Commerce
            </Text>
          </View>
          <Text
            className="text-white text-[16px] leading-[19px] text-center mt-4"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            We give hope for the best
          </Text>
          <View className="flex flex-col items-center mt-[64px]">
            <Pressable
              className="px-[32px] py-[16px] bg-white w-[283px] rounded-[8px]"
              onPress={() => {
                router.push("/selectProfile");
              }}
            >
              <Text
                className="text-[#272757] text-[16px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
        <View className=" h-[40%] justify-end">
          <Text
            className="text-[#ffffff] text-[16px] leading-[24px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Powered By Piolife
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
