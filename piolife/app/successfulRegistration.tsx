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
  ImageBackground,
} from "react-native";
const logo = require("../assets/images/splash-icon.png");
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
const backgroundImage = require("../assets/images/Ellipse 1xxxx.png");

const SuccesfulRegistration = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]  min-h-screen  items-center justify-center">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex flex-col gap-[106px]">
        <View className="flex flex-col gap-[32px] items-center">
          <Image source={logo} className="w-[104px] h-[78px]" />
          <View className="flex flex-col gap-[16px]">
            <Text
              className="text-[#272757] text-[20px] leading-[24px] text-center "
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Registration Successful
            </Text>
            <Text
              className="text-[#272757] text-[16px] leading-[24px] text-center max-w-[236px] "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Congratulations and welcome to the Piolife team
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            router.push("/(tabs)");
          }}
          className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Go To Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SuccesfulRegistration;
