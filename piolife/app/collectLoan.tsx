import React, {
  LegacyRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useFetchData, usePostData } from "@/services/api/request";
import { wallet, User, eligibility } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumberToThousands } from "@/components/reusables";
const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
const getloan = require("../assets/images/image 44-2.png");
import { API_URL } from "@/constants/api";

const CollectLoan = () => {
  const [amount, setAmount] = useState<number>(0);
  const handleChange = (value: string) => {
    const numericValue = Number(value);
    setAmount(numericValue);
  };
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        SetUser(user);
      }
    };
    loadUser();
  }, []);
  const [user, SetUser] = useState<User>();
  const token = user?.token;
  const { data, loading, error } = useFetchData<eligibility>(
    user ? `${API_URL}/api/v12/loans/${user.id}/eligibility` : "",
    { token }
  );
  function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as any).message === "string"
    );
  }

  if (data) {
    console.log("data", data);
  }

  if (error) {
    Alert.alert(error);
  }

  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/loans/${user?.id}/request`);
  if (loading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const submit = async () => {
    try {
      const response = await postData({ amount: amount });
      if (response) {
        Alert.alert("Loan Successful");
        router.push("/clientWallet");
      }
    } catch (error) {
      if (isErrorWithMessage(error)) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Signup failed: An unknown error occurred");
      }
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] ">
        <View className="flex flex-col gap-[8px]">
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
              Collect Loan
            </Text>
          </Pressable>
          <View className="flex flex-col gap-[64px]">
            <View className="px-[8px] flex flex-col gap-[8px] ">
              <View className="flex flex-col items-center">
                <Image source={getloan} className="w-[80px] h-[80px]" />
              </View>
              <View className="flex flex-col gap-[16px]">
                <View className="flex flex-col gap-[4px]">
                  <Text
                    className="text-[#272757] text-[16px] leading-[140%] "
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    Set Amount
                  </Text>
                  <Text
                    className="text-[#777777] text-[14px] leading-[140%] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    {`Your are eligible for up to ${formatNumberToThousands(
                      data?.loanEligibility
                    )} Piocoin`}
                  </Text>
                </View>

                <View className="flex items-center justify-center flex-row">
                  <Image source={piocoin} style={{ width: 27, height: 55 }} />
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={(value) => handleChange(value)}
                    placeholder="1,200.00"
                    placeholderTextColor="#aaaaaa"
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      textAlignVertical: "center", // Ensure vertical alignment
                      fontSize: 32,
                      lineHeight: 40, // Adjust lineHeight based on font size
                    }}
                  />
                </View>
              </View>
            </View>
            <Pressable
              className="h-[56px] bg-[#0E16FF] w-full rounded-[8px] justify-center"
              onPress={submit}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]} // Adjust colors for shadow effect
                start={{ x: 0.9, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0 rounded-[8px] h-[56px] flex-col items-center justify-center"
                style={{
                  borderRadius: 8,
                }}
              >
                <View className="h-[56px] flex-col items-center justify-center">
                  <Text
                    className="text-[#ffffff] text-[16px] leading-[24px] text-center"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    {isLoading ? "Loading" : "Continue"}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    overflow: "hidden",
  },
});
export default CollectLoan;
