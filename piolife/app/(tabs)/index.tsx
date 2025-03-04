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
import Feather from "@expo/vector-icons/Feather";
import { CustomTextInput } from "@/components/reusables";
import { FontAwesome } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
const wallet = require("../../assets/images/Cash Wallet.png");
const consult = require("../../assets/images/image 46.png");
const history = require("../../assets/images/image 45-2.png");
const Login = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <View className="flex flex-row items-center justify-between mt-4">
          <View className="flex w-[80%]">
            <View className="flex flex-row gap-[16px]">
              <FontAwesome name="user" size={50} color="#ccc" />

              <View className="flex flex-col gap-[4px] py-[4px]">
                <Text
                  className="text-[#030319] text-[16px] leading-[19px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Hi, Kelvin
                </Text>
                <Text
                  className="text-[#2a2a2a] text-[14px] leading-[17px] "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  ID: KEL123BIA
                </Text>
              </View>
            </View>
          </View>
          <View className="flex w-[20%] flex-row justify-end">
            <View className="flex flex-col justify-center items-center rounded-[8px] border-[#2727571A] border-[1px] w-[32] h-[32px]">
              <Octicons name="bell" size={24} color="#272757" />
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-[16px]">
          <Text
            className="text-[#272757] text-[18px] leading-[17px] "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Actions
          </Text>
          <View className="py-[8px] px-[24px] bg-[#0e16ff] flex flex-row rounded-[16px] items-center">
            <View className="w-1/3">
              <Pressable
                className="flex flex-col gap-[4px]  items-center"
                onPress={() => {
                  router.push("/clientWallet");
                }}
              >
                <Image source={wallet} className="w-[56px] h-[56px]" />
                <Text
                  className="text-[#ffffff] text-[14px] leading-[20px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Fund Your Account
                </Text>
              </Pressable>
            </View>
            <View className="h-3/4 w-[1px] bg-[#dadada]"></View>
            <View className="w-1/3">
              <Pressable
                className="flex flex-col gap-[4px]   items-center"
                onPress={() => {
                  router.push("/consult");
                }}
              >
                <Image source={consult} className="w-[56px] h-[56px]" />
                <Text
                  className="text-[#ffffff] text-[14px] leading-[20px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Consult
                </Text>
              </Pressable>
            </View>
            <View className="h-3/4 w-[1px] bg-[#dadada]"></View>
            <View className="w-1/3">
              <Pressable className="flex flex-col gap-[4px]  items-center ">
                <Image source={history} className="w-[56px] h-[56px]" />
                <Text
                  className="text-[#ffffff] text-[14px] leading-[20px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  History
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-[20px]">
          <Text
            className="text-[#272757] text-[18px] leading-[17px] "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Activity
          </Text>
          <View className="flex flex-col gap-[16px]">
            <Pressable
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
              onPress={() => {
                router.push("/clientSignup");
              }}
              style={[styles.shadowProp]}
            >
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Subscribe (App Data)
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Subscribe to continue enjoying our services
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color="black" />
            </Pressable>
            <Pressable
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
              onPress={() => {
                router.push("/clientSignup");
              }}
              style={[styles.shadowProp]}
            >
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#272757] text-[14px] leading-[20px]  "
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Set Up Passcodes
                </Text>
                <Text
                  className="text-[#272757] text-[12px] leading-[20px]  "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Lock the app with passcodes or biometrics
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color="black" />
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
  },
});
export default Login;
