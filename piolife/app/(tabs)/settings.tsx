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
import { CustomTextInput } from "@/components/reusables";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
const profile = require("../../assets/images/profile.png");
const key = require("../../assets/images/key-square.png");
const call = require("../../assets/images/call-calling.png");
const login = require("../../assets/images/login.png");
const Login = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[6%] gap-[32px]">
        <Text
          className="text-[#272757] text-[20px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Settings
        </Text>
        <View className="flex flex-col gap-[32px]">
          <View className="flex flex-row gap-[32px] items-center w-full  ">
            <View className="p-[10px] w-[44px] h-[44px] rounded-[20px] bg-white shadow-md justify-center items-center">
              <Image source={profile} className="w-[24px] h-[24px]" />
            </View>
            <View className="flex-1 flex-row justify-between items-center  ">
              <Text
                className="text-[#272757] text-[16px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Profile
              </Text>
              <Entypo name="chevron-small-right" size={24} color="black" />
            </View>
          </View>
          <View className="flex flex-row gap-[32px] items-center w-full  ">
            <View className="p-[10px] w-[44px] h-[44px] rounded-[20px] bg-white shadow-md justify-center items-center">
              <Image source={key} className="w-[24px] h-[24px]" />
            </View>
            <View className="flex-1 flex-row justify-between items-center  ">
              <Text
                className="text-[#272757] text-[16px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Login Settings
              </Text>
              <Entypo name="chevron-small-right" size={24} color="black" />
            </View>
          </View>
          <View className="flex flex-row gap-[32px] items-center w-full  ">
            <View className="p-[10px] w-[44px] h-[44px] rounded-[20px] bg-white shadow-md justify-center items-center">
              <Image source={call} className="w-[24px] h-[24px]" />
            </View>
            <View className="flex-1 flex-row justify-between items-center  ">
              <Text
                className="text-[#272757] text-[16px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Customer Support
              </Text>
              <Entypo name="chevron-small-right" size={24} color="black" />
            </View>
          </View>
          <View className="flex flex-row gap-[32px] items-center w-full  ">
            <View className="p-[10px] w-[44px] h-[44px] rounded-[20px] bg-white shadow-md justify-center items-center">
              <Image source={login} className="w-[24px] h-[24px]" />
            </View>
            <View className="flex-1 flex-row justify-between items-center  ">
              <Text
                className="text-[#272757] text-[16px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Log Out
              </Text>
              <Entypo name="chevron-small-right" size={24} color="black" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
