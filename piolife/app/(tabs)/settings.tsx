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

const Login = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <Text
          className="text-[#272757] text-[24px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Welcome back!
        </Text>
        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Kindly log in to continue
        </Text>
        <View className="flex flex-col ">
          <CustomTextInput
            label="Email"
            value={""}
            onChangeText={(value) => console.log(value)}
            placeholder="Enter Email"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={""}
          />
          <View className="flex flex-col">
            <CustomTextInput
              label="Password"
              value={""}
              onChangeText={(value) => console.log(value)}
              placeholder="Enter Password"
              placeholderTextColor={"#BABABA"}
              keyboardType="default"
              errorMessage={""}
            />
            <Text
              className="text-[#272757] text-[14px] leading-[22px] text-right "
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Forgot Password?
            </Text>
          </View>
        </View>
        <View className="flex-col flex items-center justify-center mt-4  gap-[16px]">
          <Pressable
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Log In
            </Text>
          </Pressable>
          <Text
            onPress={() => {
              router.push("/selectProfile");
            }}
            className="text-[16px] leading-[22px]"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Don’t have an account? Register
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
