import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, Pressable, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { router } from "expo-router";

const HealthIssue = () => {
  const handlePrevious = () => {
    router.back();
  };
  const [selectedId, setSelectedId] = useState<string | undefined>("english");
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "english",
        label: "English",
        value: "english",
      },
      {
        id: "yoruba",
        label: "Yoruba",
        value: "yoruba",
      },
      {
        id: "igbo",
        label: "Igbo",
        value: "igbo",
      },
      {
        id: "hausa",
        label: "Hausa",
        value: "hausa",
      },
    ],
    []
  );
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex flex-col gap-[32px]">
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
            <View className="py-[4px] flex flex-col gap-[16px]">
              <Text
                className="text-[#030319] text-[16px] leading-[24px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                  Click to select health issue
                </Text>
                (select multiple)
              </Text>
              <View>
                <Text
                  className="text-[#424242] text-[14px] leading-[17px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  NB: A single health issue selected is equivalent to
                </Text>
                <Text
                  className="text-[#424242] text-[14px] leading-[17px]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  P1500
                </Text>
              </View>
            </View>
            <View className="py-[4px] flex flex-row justify-between">
              <Text
                className="text-[#030319] text-[14px] leading-[150%]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                (1 Selected)
              </Text>
              <Text
                className="text-[#424242] text-[14px] leading-[150%]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Total: 1500
              </Text>
            </View>
          </View>

          <Pressable
            className={`px-[32px] h-[56px] bg-[#0e16ff]  rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Next
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HealthIssue;
