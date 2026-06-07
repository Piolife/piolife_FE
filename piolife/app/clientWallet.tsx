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
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { FontAwesome } from "@expo/vector-icons";
import { useFetchData, usePostData } from "@/services/api/request";
import { wallet, User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddFundsModal from "@/components/addFundsModal";
import { BlurView } from "expo-blur";
import { formatNumberToThousands } from "@/components/reusables";
import axios from "axios";
const wallety = require("../assets/images/Cash Wallet.png");
const piocoin = require("../assets/images/piocoin_symbol-removebg-preview 1.png");
const fundwallet = require("../assets/images/image 47.png");
const getloan = require("../assets/images/image 44-2.png");
import { API_URL } from "@/constants/api";
const ClientWallet = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
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
  const { data, loading, error, refetch } = useFetchData<wallet>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  if (data) {
    console.log("data", data);
  }

  if (error) {
    Alert.alert(error);
  }
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };
  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };
  const handleSubmit = () => {
    handleCloseBottomSheet();
    paystackWebViewRef?.current?.startTransaction();
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 20 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
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
              Wallet
            </Text>
          </Pressable>
          <View className="flex items-center">
            <Image source={wallety} className="w-[80px] h-[80px]" />
          </View>
          <View className="flex flex-col gap-[16px]">
            <Text
              className="text-[#030319] text-[14px] leading-[17px] "
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Available Balance
            </Text>
            <View
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-col gap-[16px]  bg-white "
              style={[styles.shadowProp]}
            >
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Main Balance
              </Text>
              <View className="flex flex-row gap-[4px] items-center">
                <Image source={piocoin} className="w-[16px] h-[33px]" />
                <Text
                  className="text-[#030319] text-[20px] leading-[20px]  "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {formatNumberToThousands(data?.balance)}
                </Text>
              </View>
            </View>
            <View
              className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-col gap-[16px]  bg-white "
              style={[styles.shadowProp]}
            >
              <Text
                className="text-[#272757] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Loan Balance
              </Text>
              <View className="flex flex-row gap-[4px] items-center">
                <Image source={piocoin} className="w-[16px] h-[33px]" />
                <Text
                  className="text-[#030319] text-[20px] leading-[20px]  "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {formatNumberToThousands(data?.loanBalance)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-[16px]">
          <Text
            className="text-[#272757] text-[18px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Actions
          </Text>
          <View className="flex flex-row justify-between">
            <Pressable
              // onPress={() => paystackWebViewRef?.current?.startTransaction()}
              onPress={handleOpenBottomSheet}
              className="py-[8px] px-[16px] bg-[#0e16ff] w-[48%] rounded-[4px] gap-[4px] items-center"
            >
              <Image source={fundwallet} className="w-[60px] h-[46px]" />
              <Text
                className="text-[#ffffff] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Fund wallet
              </Text>
            </Pressable>
            <Pressable
              className="py-[8px] px-[16px] bg-[#0e16ff] w-[48%] rounded-[4px] gap-[4px] items-center"
              onPress={() => {
                router.push("/collectLoan");
              }}
            >
              <Image source={getloan} className="w-[46px] h-[46px]" />
              <Text
                className="text-[#ffffff] text-[14px] leading-[20px]  "
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Collect Loan
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <AddFundsModal
        isVisible={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAmountChange={handleAmountChange}
        onSubmit={handleSubmit}
      />
      {isBottomSheetOpen && (
        <BlurView style={styles.absolute} intensity={20} tint="dark" />
      )}
      <Paystack
        metadata={{
          cart_id: user?.id, // or use email or another unique ID
        }}
        paystackKey="pk_test_10f0bf166cf0c44bfa35b7f7f0ea72f24c01a60c"
        billingEmail={user?.email ?? ""}
        amount={amount}
        onCancel={() => {
          Alert.alert("Funding cancelled", "Your payment was not completed.");
        }}
        onSuccess={async (res) => {
          try {
            const reference =
              res?.transactionRef?.reference ??
              res?.data?.reference ??
              String(res?.transactionRef?.trans ?? "");
            if (reference && user?.id) {
              await axios.post(
                `${API_URL}/api/v12/wallet/${user.id}/deposit`,
                { reference },
                { headers: { Authorization: `Bearer ${user.token}` } }
              );
            }
            Alert.alert("Funding successful", "Your wallet has been credited.");
            refetch();
          } catch {
            Alert.alert(
              "Funding successful",
              "Payment received. Balance will update shortly."
            );
            refetch();
          }
        }}
        ref={paystackWebViewRef as unknown as LegacyRef<ReactNode>}
      />
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
export default ClientWallet;
