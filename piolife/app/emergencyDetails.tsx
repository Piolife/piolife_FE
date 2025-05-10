import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Platform } from "react-native";
const EmergencyDetails = () => {
  const handlePrevious = () => {
    router.back();
  };
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    role: "",
  });
  const handleChange = (name: any, value: any) => {
    //   const validationErrors = validateLoginForm(formData);
    //   setErrors(validationErrors);
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if header exists
      >
        <View className=" flex flex-col justify-between px-[4%]">
          <View className="py-[16px]  gap-[24px]">
            <Pressable
              className="flex flex-row items-center gap-[16px] mt-2"
              onPress={handlePrevious}
            >
              <FontAwesome name="angle-left" size={24} color="black" />
              <Text
                className="text-[#272757] text-[16px] leading-[20px] text-center"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Back
              </Text>
            </Pressable>
          </View>
          <ScrollView className="">
            <View className="flex flex-col gap-[16px]">
              <View className="flex flex-col gap-[8px]">
                <Text
                  className="text-[#030319] text-[16px] leading-[17px]"
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  We Are Here To Assist You
                </Text>
                <Text
                  className="text-[#424242] text-[14px] leading-[17px]"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  Kindly fill out this form with the appropriate information
                </Text>
              </View>
              <CustomTextInput
                label="Name of caller"
                value={""}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="Child’s Name"
                placeholderTextColor={"#BABABA"}
                keyboardType="default"
                errorMessage={""}
              />
              <CustomPicker
                label="State of Incident"
                value={formData.gender || ""}
                onValueChange={(value) => handleChange("gender", value)}
                items={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                placeholder="Select your gender"
                // error={errors.gender}
              />
              <CustomTextInput
                label="LGA"
                value={""}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="Enter Age"
                placeholderTextColor={"#BABABA"}
                keyboardType="default"
                errorMessage={""}
              />
              <CustomTextInput
                label="Ward"
                value={""}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="Enter Age"
                placeholderTextColor={"#BABABA"}
                keyboardType="default"
                errorMessage={""}
              />
            </View>

            <Pressable className="px-[32px] h-[56px] bg-[#0e16ff] rounded-[8px] flex items-center justify-center mb-[12px] mt-8">
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Next
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencyDetails;
