import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

const amico = require("../assets/images/amico.png");
const nysc = require("../assets/images/nysc.png");
const house = require("../assets/images/house.png");
const RealEstate = () => {
  const handlePrevious = () => {
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[24px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-2"
          onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px] leading-[20px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>
        <View className="flex flex-col gap-[24px]">
          <Text
            className="text-[#030319] text-[16px] leading-[100%]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Find the perfect space for{" "}
            <Text
              className="text-[#030319] text-[16px] leading-[100%]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Your Dream Home
            </Text>{" "}
            with{" "}
            <Text
              className="text-[#030319] text-[16px] leading-[100%]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Pioland
            </Text>
          </Text>

          <View className="rounded-[8px] py-[16px] gap-[16px] flex flex-row bg-[##27275733] items-center w-full justify-center">
            <Image source={amico} className="h-[153px] w-[220px]" />
          </View>
          <View className="flex flex-col gap-[24px]">
            <Text
              className="text-[#030319] text-[16px] leading-[100%]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              We have a package just for You
            </Text>
            <View className="flex flex-col gap-[16px]">
              <Pressable
                className="rounded-[4px] p-[16px] border-[#DADADA80] border-[1px] gap-[8px]  flex flex-row justify-between items-center bg-[#fffff0]"
                style={[styles.shadowProp]}
              >
                <View className="flex flex-row gap-[8px] items-center flex-1">
                  <Image source={nysc} className="w-[60px] h-[42px]" />
                  <Text
                    className="text-[#030319] text-[12px] leading-[100%] flex-1"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    Student / NYSC Corp members package
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="black" />
              </Pressable>
              <Pressable
                className="rounded-[4px] p-[16px] border-[#DADADA80] border-[1px] gap-[8px]  flex flex-row justify-between items-center bg-[#fffff0]"
                onPress={() => {
                  router.push("/states");
                }}
                style={[styles.shadowProp]}
              >
                <View className="flex flex-row gap-[8px] items-center flex-1">
                  <Image source={house} className="w-[60px] h-[42px]" />
                  <Text
                    className="text-[#030319] text-[12px] leading-[100%] flex-1"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    Pioland Properties
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="black" />
              </Pressable>
              <Pressable
                className="rounded-[4px] p-[16px] border-[#DADADA80] border-[1px] gap-[8px]  flex flex-row justify-between items-center bg-[#fffff0]"
                style={[styles.shadowProp]}
              >
                <View className="flex flex-row gap-[8px] items-center flex-1">
                  <Image source={house} className="w-[60px] h-[42px]" />
                  <Text
                    className="text-[#030319] text-[12px] leading-[100%] flex-1"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    Luxury Apartment
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="black" />
              </Pressable>
            </View>
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
    elevation: 5,
  },
});
export default RealEstate;
