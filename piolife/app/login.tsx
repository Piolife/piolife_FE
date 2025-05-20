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

const Login = () => {
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
        console.log();
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
      console.log("err", err);
      if (err.otpToken) {
        // Maybe redirect to a verification screen with the token
        await AsyncStorage.setItem("verificationToken", err.otpToken);

        router.push({
          pathname: "/otp",
          params: { otpToken: err.otpToken },
        });
      }
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <Text
          className="text-[#272757] text-[24px] leading-[24px] text-center mt-4"
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
          <CustomPicker
            label="Role"
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
            items={[
              { label: "Client", value: "client" },
              { label: "Medical Practitioner", value: "medical_practitioner" },
              { label: "Emergency Services", value: "emergency_services" },
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
          <View className="flex flex-col">
            <CustomTextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              placeholder="Enter Password"
              placeholderTextColor={"#BABABA"}
              keyboardType="default"
              errorMessage={errors.password}
            />
            <Pressable
              onPress={() => {
                router.push("/resetPassword");
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
            className={`px-[32px] h-[56px] bg-[#0e16ff] w-[283px] rounded-[8px] flex items-center justify-center`}
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
