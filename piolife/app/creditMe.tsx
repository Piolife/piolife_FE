import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, SafeAreaView, View, Text, Platform } from "react-native";

const CreditMe = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <View className="px-[4%]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-2"
          // onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px] leading-[20px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>
        <View className="flex flex-col gap-[48px] py-[16px]">
          <Text
            className="text-[#272757] text-[14px] leading-[150%] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            NB: Your balance and No. of consultation will reset back to zero
            after withdrawal
          </Text>
          <View className="flex flex-col gap-[32px]"></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreditMe;
