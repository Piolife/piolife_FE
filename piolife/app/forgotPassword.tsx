import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { LoginFormProps, ResetPasswordFormProps } from "@/services/core/types";
import { validateForgetPasswordForm, validateLoginForm } from "@/hooks/auth";
import { usePostData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";

type LoginResponse = {
  message: string;
  token: string;
  otp: string;
};

const ForgotPassword = () => {
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/users/request-password-reset`);
  const [errors, setErrors] = useState<Partial<ResetPasswordFormProps>>({});
  const [formData, setFormData] = useState<ResetPasswordFormProps>({
    email: "",
    role: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateForgetPasswordForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePasswordReset = async () => {
    const trimmedData: ResetPasswordFormProps = {
      email: formData.email.trim(),
      role: formData.role.trim(),
    };

    const validationErrors = validateForgetPasswordForm(trimmedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = (await postData(trimmedData)) as LoginResponse;

      if (response) {
        router.push({
          pathname: "/passwordResetOTP",
          params: {
            email: formData.email,
            role: formData.role,
          },
        });
        Toast.show({
          type: "success",
          text2: response.message,
          position: "top",
          topOffset: 80,
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err.message,
        position: "top",
        topOffset: 80,
      });
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
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
            back
          </Text>
        </Pressable>
        <Text
          className="text-[#272757] text-[24px] leading-[24px] text-center mt-4"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Forgot password
        </Text>
        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Please enter your email to reset password
        </Text>
        <View className="flex flex-col ">
          <CustomPicker
            label="Role"
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
            items={[
              { label: "Client", value: "client" },
              { label: "Medical Practitioner", value: "medical_practitioner" },
              { label: "Emergency Services", value: "emergency_services" },
              { label: "Pharmacy Services", value: "pharmacy_services" },
              {
                label: "Medical Laboratory Services",
                value: "medical_lab_services",
              },
            ]}
            placeholder="Sign-in as"
            error={errors.role}
          />
          <CustomTextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="Enter Email"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.email}
          />
        </View>
        <View className="flex-col flex items-center justify-center mt-4  gap-[16px] w-full">
          <Pressable
            disabled={isLoading}
            onPress={handlePasswordReset}
            // onPress={() => {
            //   router.push("/passwordResetOTP");
            // }}
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-full rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {isLoading ? "Submitting..." : "Reset Password"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
