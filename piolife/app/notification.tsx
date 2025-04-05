import React from "react";
import { Pressable, SafeAreaView, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";

const Notification = () => {
  return (
    <SafeAreaView className="bg-[#0E16FF] ">
      <StatusBar style="light" backgroundColor="#ffffff" />

      <View className="">
        {/* Back Button */}
        <Pressable className="flex flex-row items-center gap-[16px] mt-2 py-[8px] px-[4%]">
          <FontAwesome name="angle-left" size={24} color="white" />
          <Text
            className="text-[#ffffff] text-[16px] leading-[100%]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Notification
          </Text>
        </Pressable>

        {/* Content */}
        <View className="bg-[#FFFFFF] rounded-t-[16px] flex-1 pt-10" />
      </View>
    </SafeAreaView>
  );
};

export default Notification;
