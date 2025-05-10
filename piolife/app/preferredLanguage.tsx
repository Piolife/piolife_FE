import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, Pressable, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { router } from "expo-router";

const PrefferedLanguage = () => {
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
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
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
          <View className="flex flex-col gap-[16px]">
            <Text
              className="text-[#030319] text-[16px] leading-[24px]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Consult a doctor
            </Text>
            <Text
              className="text-[#424242] text-[14px] leading-[17px]"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Fill the form below, as the information provided will help us get
              the right doctor to you.
            </Text>
          </View>
          <View className="flex flex-col gap-[24px]">
            <Text
              className="text-[#030319] text-[16px] leading-[24px]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              Preferred Language (select just one)
            </Text>
            <RadioGroup
              layout="column"
              containerStyle={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                gridRowGap: "16px",
                rowGap: "16px",
              }}
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
          </View>
          <Pressable
            onPress={() => {
              router.push("/healthIssue");
            }}
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

export default PrefferedLanguage;
