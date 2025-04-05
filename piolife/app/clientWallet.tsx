import React, { LegacyRef, ReactNode, useRef } from "react";
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
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { CustomTextInput } from "@/components/reusables";
import { FontAwesome } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
const wallet = require("../assets/images/Cash Wallet.png");
const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
const fundwallet = require("../assets/images/image 47.png");
const getloan = require("../assets/images/image 44-2.png");
const ClientWallet = () => {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <View className="flex flex-col gap-[8px]">
          <Pressable
            className="flex flex-row items-center gap-[16px] "
            onPress={() => {
              router.back();
            }}
          >
            <FontAwesome name="angle-left" size={24} color="black" />
            <Text
              className="text-[#272757] text-[16px] leading-[20px] text-center "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Wallet
            </Text>
          </Pressable>
          <View className="flex items-center">
            <Image source={wallet} className="w-[80px] h-[80px]" />
          </View>
          <View className="flex flex-col gap-[16px]">
            <Text
              className="text-[#030319] text-[14px] leading-[17px] "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Available Balance
            </Text>
            <View
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-col gap-[16px]  bg-white "
              style={[styles.shadowProp]}
            >
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Main Balance
              </Text>
              <View className="flex flex-row gap-[4px] items-center">
                <Image source={piocoin} className="w-[16px] h-[33px]" />
                <Text
                  className="text-[#030319] text-[20px] leading-[20px]  "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  2,209.00
                </Text>
              </View>
            </View>
            <View
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-col gap-[16px]  bg-white "
              style={[styles.shadowProp]}
            >
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Loan Balance
              </Text>
              <View className="flex flex-row gap-[4px] items-center">
                <Image source={piocoin} className="w-[16px] h-[33px]" />
                <Text
                  className="text-[#030319] text-[20px] leading-[20px]  "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  2,209.00
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-[16px]">
          <Text
            className="text-[#272757] text-[18px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Actions
          </Text>
          <View className="flex flex-row justify-between">
            <Pressable
              onPress={() => paystackWebViewRef?.current?.startTransaction()}
              className="py-[8px] px-[16px] bg-[#0e16ff] w-[48%] rounded-[4px] gap-[4px] items-center"
            >
              <Image source={fundwallet} className="w-[60px] h-[46px]" />
              <Text
                className="text-[#ffffff] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Fund wallet
              </Text>
            </Pressable>
            <Pressable className="py-[8px] px-[16px] bg-[#0e16ff] w-[48%] rounded-[4px] gap-[4px] items-center">
              <Image source={getloan} className="w-[46px] h-[46px]" />
              <Text
                className="text-[#ffffff] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Collect Loan
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Paystack
        paystackKey="pk_test_10f0bf166cf0c44bfa35b7f7f0ea72f24c01a60c"
        billingEmail="chijiokenwoye64@gmail.com"
        amount={"15000.00"}
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
          console.log("res", res);
        }}
        ref={paystackWebViewRef as unknown as LegacyRef<ReactNode>}
      />
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
export default ClientWallet;
