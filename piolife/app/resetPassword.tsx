import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { LoginFormProps } from "@/services/core/types";
import { NewPasswordValidate, validateLoginForm } from "@/hooks/auth";
import { usePostData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@/constants/api";
type LoginResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
    isVerified: boolean;
    dateOfBirth: string;
  };
};
export type NewPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/users/reset-password`);
  const { token } = useLocalSearchParams();
  const [errors, setErrors] = useState<Partial<NewPasswordForm>>({});
  const [formData, setFormData] = useState<NewPasswordForm>({
    password: "",
    confirmPassword: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = NewPasswordValidate(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = async () => {
    const trimmedData: NewPasswordForm = {
      confirmPassword: formData.confirmPassword.trim(),
      password: formData.password.trim(),
    };

    const validationErrors = NewPasswordValidate(trimmedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const payload = {
        ...trimmedData,
        token: token,
      };
      const response = (await postData(payload)) as LoginResponse;

      if (response) {
        router.push({
          pathname: "/login",
        });
      }
    } catch (err: any) {
      Alert.alert("SignIn failed: " + err.message);
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
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
          Reset password
        </Text>
        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Please enter your email to reset password
        </Text>
        <View className="flex flex-col gap-[24px]">
          <CustomTextInput
            label="Enter New Password"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            placeholder="Enter Password"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.password}
            secureTextEntry={true}
          />
          <CustomTextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            placeholder="Enter confirm Password"
            placeholderTextColor={"#BABABA"}
            keyboardType="default"
            errorMessage={errors.confirmPassword}
            secureTextEntry={true}
          />
        </View>
        <View className="flex-col flex items-center justify-center mt-4  gap-[16px]">
          <Pressable
            disabled={isLoading}
            onPress={handleLogin}
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-full rounded-[8px] flex items-center justify-center`}
          >
            <Text
              className="text-white text-[16px]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {isLoading ? "Submitting..." : "Update Password"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
