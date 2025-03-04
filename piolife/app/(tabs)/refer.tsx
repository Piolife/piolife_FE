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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[24px] gap-[32px]">
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
            The more you refer, the more you earn!
          </Text>
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
export default Refer;
