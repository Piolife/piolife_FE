import {
  Text,
  View,
  Pressable,
  Platform,
  Alert,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import OtpTextInput from "react-native-text-input-otp";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { usePostData, useFetchData, useGetData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { ResetPasswordFormProps } from "@/services/core/types";
import Toast from "react-native-toast-message";

const PasswordOtp = () => {
  const [otp, setOtp] = React.useState("");
  const { email, role } = useLocalSearchParams();
  const singleEmail = Array.isArray(email) ? email[0] : email;
  const singleRole = Array.isArray(role) ? role[0] : role;

  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/users/verify-reset-otp`);
  const {
    data,
    loading,
    postData: resetPassword,
  } = usePostData(`${API_URL}/api/v12/users/request-password-reset`);

  const handlePasswordReset = async () => {
    const trimmedData: ResetPasswordFormProps = {
      email: singleEmail,
      role: singleRole,
    };

    try {
      const response = (await resetPassword(trimmedData)) as any;
      console.log(response);
      if (response) {
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
  const obfuscateEmail = (email: string): string => {
    const [username, domain] = email.split("@");
    const firstPart = username.slice(0, 3);
    return `${firstPart}....@${domain}`;
  };

  //   if (!singleEmail || typeof singleEmail !== "string") return null;
  const verifyOtp = async () => {
    const trimmedData: any = {
      otp: otp,
      email: singleEmail,
    };

    try {
      const response = (await postData(trimmedData)) as any;

      if (response) {
        router.push({
          pathname: "/resetPassword",
          params: {
            token: response.token,
          },
        });
        // Toast.show({
        //   type: "success",
        //   text2: response.message,
        //   position: "top",
        //   topOffset: 80,
        // });
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
  React.useEffect(() => {
    if (otp.length === 6) {
      const timer = setTimeout(() => {
        verifyOtp();
      }, 500); // 0.5 second delay
      return () => clearTimeout(timer);
    }
  }, [otp]);

  if (loading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  if (!singleEmail || !singleRole) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Missing required parameters. Please try again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View className="p-4 flex  flex-col flex-1">
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
        <View className="flex flex-col items-center justify-center gap-[24px]">
          <Text
            className="text-[#272757] text-[24px] leading-[35px] text-center mt-8"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Check your email
          </Text>
          <Text
            className="text-[#272757] text-[14px] leading-[22px] text-center "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Please enter the 6 digit code sent to {obfuscateEmail(singleEmail)}{" "}
            reset password
          </Text>
        </View>
        <View className="flex items-center mt-8">
          <OtpTextInput
            otp={otp}
            setOtp={setOtp}
            digits={6}
            style={{
              borderRadius: 8,
              height: 50,
              backgroundColor: "#F5FBFF",
              borderColor: "#A5A5A5",
              borderWidth: 1,
              textAlign: "center",
            }}
            fontStyle={{ fontSize: 20, fontWeight: "bold" }}
            focusedStyle={{ borderColor: "#0BA5EC", borderBottomWidth: 3 }}
          />
          <View className="flex flex-col items-center mt-8">
            <View className="flex flex-row items-center">
              <Text
                className="text-center  text-[16px] text-[#121212] leading-[22px] mr-[2px]"
                style={{ fontFamily: "Inter_400Regular" }}
              >
                Haven’t gotten the email?
              </Text>
              <Pressable onPress={handlePasswordReset}>
                <Text
                  className="text-[#121212] text-[16px] leading-[25px]"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {loading ? "Sending" : "Resend code"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  text: {
    fontSize: 25,
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default PasswordOtp;
