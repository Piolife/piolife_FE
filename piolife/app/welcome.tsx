import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/conz.png");
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
const backgroundImage = require("../assets/images/Ellipse 1xxxx.png");

const Welcome = () => {
  return (
    <SafeAreaView
      className="flex-1  "
      >
      <View className="flex items-center justify-center my-32">
        <Image source={logo} className="w-[104px] h-[78px]" />
      </View>

      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        className="   px-1 h-screen "
      >
        <StatusBar style="dark" backgroundColor="#ffffff" />

        <View className="flex flex-col   mt-16">
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
          {/* PRD: show signup bonus on welcome screen */}
          <View
            style={{
              marginTop: 24,
              marginHorizontal: 24,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#fffff0",
                textAlign: "center",
              }}
            >
              🎁 Sign up now & get 200 PioCoins FREE
            </Text>
          </View>

          <View className="flex flex-col items-center justify-center mt-[40px]">
            <Pressable
              className="h-[56px] bg-white w-[283px] rounded-[8px] justify-center"
              onPress={() => {
                router.push("/selectProfile");
              }}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]} // Adjust colors for shadow effect
                start={{ x: 0.9, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0 rounded-[8px] h-[56px] flex-col items-center justify-center"
                style={{
                  borderRadius: 8,
                }}
              >
                <View className="h-[56px] flex-col items-center justify-center">
                  <Text
                    className="text-[#272757] text-[16px] leading-[24px] text-center"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    Get Started
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          <View className=" h-full ">
            <Text
              className={`text-[#ffffff] text-[16px] leading-[24px] text-center ${
                Platform.OS === "android" ? "mt-16 " : "mt-24 "
              }`}
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Powered By Piolife
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Welcome;
