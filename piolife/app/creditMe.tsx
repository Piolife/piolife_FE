/**
 * app/creditMe.tsx — REWRITTEN
 *
 * Previously empty. Now shows:
 *  - Consultation count & earned amount
 *  - Withdraw / Credit Me button
 *  - Transaction statement
 * Per prototype: counter resets after successful credit.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const CONSULT_FEE = 500;

const CreditMe = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;
  const isProvider = [
    "medical_practitioner",
    "pharmacy_services",
    "medical_lab_services",
    "emergency_services",
  ].includes(user?.role ?? "");

  const {
    data: wallet,
    loading: walletLoading,
    refetch,
  } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  const { data: consultations, loading: consultLoading } = useFetchData<any[]>(
    user?.role === "medical_practitioner"
      ? `${API_URL}/api/v12/sessions/consultations/practitioner/${user.id}`
      : "",
    { token }
  );

  const { loading: crediting, postData: requestCredit } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/withdraw`
  );

  const count = Array.isArray(consultations) ? consultations.length : 0;
  const amount = count * CONSULT_FEE;

  const handleCredit = () => {
    if (count === 0 && !wallet?.balance) {
      Toast.show({
        type: "error",
        text1: "Nothing to withdraw",
        position: "bottom",
      });
      return;
    }
    const withdrawAmt = isProvider ? amount : wallet?.balance ?? 0;
    Alert.alert(
      "Request Payout",
      `Request ₦${formatNumberToThousands(
        withdrawAmt
      )} payout?\n\nOur admin will verify and credit your bank account.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await requestCredit({ amount: withdrawAmt });
              refetch();
              Toast.show({
                type: "success",
                text1: "Payout requested!",
                text2: "Processing within 24 hours.",
                position: "bottom",
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Failed",
                text2: err?.message,
                position: "bottom",
              });
            }
          },
        },
      ]
    );
  };

  if (walletLoading || consultLoading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />
      <View
        style={{
          backgroundColor: "#272757",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 40,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          Withdraw Earnings
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.65)",
            marginTop: 4,
          }}
        >
          NB: Counter resets to zero after successful withdrawal
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#888",
                marginBottom: 4,
              }}
            >
              Consulted
            </Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 32,
                color: "#0E16FF",
              }}
            >
              {count}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#888",
                marginBottom: 4,
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 24,
                color: "#16A34A",
              }}
            >
              ₦{formatNumberToThousands(amount)}
            </Text>
          </View>
        </View>

        {/* Wallet balance */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#888",
              marginBottom: 4,
            }}
          >
            Wallet Balance
          </Text>
          <Text
            style={{
              fontFamily: "Inter_800ExtraBold",
              fontSize: 30,
              color: "#272757",
            }}
          >
            ₦{formatNumberToThousands(wallet?.balance ?? 0)}
          </Text>
        </View>

        {/* Credit Me button */}
        <Pressable
          onPress={handleCredit}
          disabled={crediting}
          style={({ pressed }) => ({
            backgroundColor: crediting ? "#7B83FF" : "#0E16FF",
            borderRadius: 14,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.88 : 1,
            shadowColor: "#0E16FF",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
            marginBottom: 16,
          })}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "#fffff0",
            }}
          >
            {crediting ? "Requesting…" : "💳 Credit Me"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/walletHistory")}
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#272757",
            }}
          >
            📊 View Statement
          </Text>
          <Feather name="chevron-right" size={18} color="#888" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditMe;
