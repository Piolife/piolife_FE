import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@stream-io/video-react-native-sdk";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
const user = require("../../assets/images/image 42-2.png");
const piocoin = require("../../assets/images/piocoin-removebg-preview 1.png");

const Refer = () => {
  const [activeUser, SetActiveUser] = useState<any>();
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        SetActiveUser(user);
      }
    };
    loadUser();
    AsyncStorage.setItem("hasLaunched", "launched");
  }, []);
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <Toast />
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
                {activeUser?.username}
              </Text>
            </View>
            <Pressable
              className="bg-[#0e16ff]  py-[8px] px-[16px] rounded-[8px] border-[#dadada] border-[1px]"
              onPress={() => {
                if (activeUser?.username) {
                  Clipboard.setStringAsync(activeUser.username);
                  Toast.show({
                    type: "success",
                    text1: "Copied to Clipboard",
                    text2: activeUser.username,
                    position: "top",
                    topOffset: 80,
                  });
                }
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
