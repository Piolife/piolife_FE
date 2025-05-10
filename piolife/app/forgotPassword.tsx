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
import { router } from "expo-router";
import { CustomPicker, CustomTextInput } from "@/components/reusables";
import { LoginFormProps } from "@/services/core/types";
import { validateLoginForm } from "@/hooks/auth";
import { usePostData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

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

const ForgotPassword = () => {
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData("https://piolife-be.onrender.com/api/v12/users/login");
  const [errors, setErrors] = useState<Partial<LoginFormProps>>({});
  const [formData, setFormData] = useState<LoginFormProps>({
    email: "",
    password: "",
    role: "",
  });
  const handleChange = (name: any, value: any) => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = async () => {
    const trimmedData: LoginFormProps = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role.trim(),
    };

    const validationErrors = validateLoginForm(trimmedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = (await postData(trimmedData)) as LoginResponse;
      console.log("SignIn successful", response);

      if (response?.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
        router.push({
          pathname: "/(tabs)",
          params: {
            userId: response.user.id,
            role: response.user.role,
          },
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
          Forgot password
        </Text>
        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Please enter your email to reset password
        </Text>
        <View className="flex flex-col ">
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
        <View className="flex-col flex items-center justify-center mt-4  gap-[16px]">
          <Pressable
            disabled={isLoading}
            onPress={handleLogin}
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
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
