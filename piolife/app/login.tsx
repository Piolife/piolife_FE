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
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  CustomPicker,
  CustomPickerTwo,
  CustomTextInput,
} from "@/components/reusables";
import { LoginFormProps } from "@/services/core/types";
import { validateLoginForm } from "@/hooks/auth";
import { usePostData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { getCurrentLocation } from "@/components/reusables";
import { API_URL } from "@/constants/api";

export type LoginResponse = {
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
export const toastConfig = {
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#fff",
        borderLeftColor: "red",
        zIndex: 9999,
        elevation: 9999,
        position: "absolute", // helps with layering
        top: 120,
      }}
      text1Style={{ color: "black", fontWeight: "bold" }}
      text2Style={{ color: "black" }}
    />
  ),
  // Add more types (info, success) if needed
};
const Login = () => {
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/users/login`);
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

      if (response?.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
        AsyncStorage.setItem("hasLaunched", "launched");
        await AsyncStorage.setItem("userEmail", formData.email);
        router.push({
          pathname: "/(tabs)",
          params: {
            userId: response.user.id,
            role: response.user.role,
          },
        });
      }
    } catch (err: any) {
      console.log("error", err);
      Toast.show({
        type: "error",
        text2: err.message,
        position: "top",
        topOffset: 80,
      });
      if (err.otpToken) {
        await AsyncStorage.setItem("verificationToken", err.otpToken);

        router.push({
          pathname: "/otp",
          params: { otpToken: err.otpToken, email: formData.email },
        });
      }
    }
  };
  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      if (savedEmail) {
        setFormData((prev) => ({
          ...prev,
          email: savedEmail,
        }));
      }
    };

    loadEmail();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <Text
          className="text-[#272757] text-[24px] leading-[24px] text-center mt-10"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          Welcome back!
        </Text>
        <Text
          className="text-[#272757] text-[16px] leading-[22px] text-center "
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Kindly log in to continue
        </Text>
        <View className="flex flex-col ">
          <CustomPickerTwo
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
            label="Role"
            error={errors.role}
            placeholder="Sign-in as"
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
          <View className="flex flex-col">
            <CustomTextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              placeholder="Enter Password"
              placeholderTextColor={"#BABABA"}
              keyboardType="default"
              errorMessage={errors.password}
              secureTextEntry={true}
            />
            <Pressable
              onPress={() => {
                router.push("/forgotPassword");
              }}
            >
              <Text
                className="text-[#272757] text-[14px] leading-[22px] text-right "
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Forgot Password?
              </Text>
            </Pressable>
          </View>
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
              {isLoading ? "Submitting..." : "Log In"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/selectProfile");
            }}
          >
            <Text
              className="text-[16px] leading-[22px]"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Don’t have an account? Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
