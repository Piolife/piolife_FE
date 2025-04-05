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
const user = require("../../assets/images/image 42-2.png");
const piocoin = require("../../assets/images/piocoin-removebg-preview 1.png");

const Refer = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <Text
          className="text-[#272757] text-[20px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Refer and Earn
        </Text>

        <View className="flex flex-col items-center">
          <Image source={piocoin} className="h-[156px] w-[200px]" />
        </View>
        <View className="flex flex-col gap-[24px]">
          <Text
            className="text-[#030319] text-[16px] leading-[22px] text-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Refer a friend with your link and earn 10 Piocoins.{"\n"}
            {"\n"}
            The more you refer, the more you earn!
          </Text>
          <View className="flex flex-row gap-[16px] items-center">
            <View className="flex-1 flex-row gap-[16px]  border-[#a5a5a5] border-[1px] rounded-[8px] p-[12px] ">
              <Text
                className="text-[#030319] text-[14px] leading-[100%] text-center"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Edu2i579mh
              </Text>
            </View>
            <Pressable
              className="bg-[#0e16ff]  py-[8px] px-[16px] rounded-[8px] border-[#dadada] border-[1px]"
              onPress={() => {
                router.push("/realEstate");
              }}
            >
              <Text
                className="text-[#ffffff] text-[14px] leading-[24px] text-center"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Copy
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Refer;
