/**
 * app/subscription.tsx — NEW SCREEN
 *
 * VIP / VVIP plans per CONZOT+ prototype:
 *  - VIP  ₦100,000 / year — unlimited consultations
 *  - VVIP ₦300,000 / year — unlimited consultations + emergency
 *  - Health Insurance ₦50,000 / month (surgery coverage after 1yr)
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePostData, useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const PLANS = [
  {
    id: "vip",
    label: "VIP",
    price: 100000,
    period: "/ year",
    color: "#0E16FF",
    bg: "#EEF0FF",
    features: [
      "Unlimited consultations for 1 year",
      "Priority doctor matching",
      "Full medical history access",
      "Prescription & lab ordering",
    ],
  },
  {
    id: "vvip",
    label: "VVIP",
    price: 300000,
    period: "/ year",
    color: "#272757",
    bg: "#F0F0F8",
    badge: "Best Value",
    features: [
      "Everything in VIP",
      "Unlimited emergency response for 1 year",
      "24/7 ambulance priority dispatch",
      "Dedicated support line",
    ],
  },
  {
    id: "insurance",
    label: "Health Insurance",
    price: 50000,
    period: "/ month",
    color: "#1D6A3A",
    bg: "#E6F4EC",
    features: [
      "Monthly premium plan",
      "Surgery coverage after 12 months of payments",
      "Must not have pending surgery at sign-up",
      "Covers hospitalisation & procedures",
    ],
  },
];

const PlanCard = ({
  plan,
  onSubscribe,
  subscribing,
}: {
  plan: (typeof PLANS)[0];
  onSubscribe: () => void;
  subscribing: boolean;
}) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#272757",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 2,
      borderColor: `${plan.color}20`,
    }}
  >
    {plan.badge && (
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: plan.color,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 11,
            color: "#fffff0",
          }}
        >
          {plan.badge}
        </Text>
      </View>
    )}
    <Text
      style={{
        fontFamily: "Inter_800ExtraBold",
        fontSize: 22,
        color: plan.color,
      }}
    >
      {plan.label}
    </Text>
    <View
      style={{
        flexDirection: "row",
        alignItems: "baseline",
        gap: 4,
        marginTop: 4,
        marginBottom: 16,
      }}
    >
      <Text
        style={{ fontFamily: "Inter_700Bold", fontSize: 28, color: "#272757" }}
      >
        ₦{formatNumberToThousands(plan.price)}
      </Text>
      <Text
        style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#888" }}
      >
        {plan.period}
      </Text>
    </View>
    {plan.features.map((f, i) => (
      <View
        key={i}
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 8,
          alignItems: "flex-start",
        }}
      >
        <Feather
          name="check-circle"
          size={16}
          color={plan.color}
          style={{ marginTop: 2 }}
        />
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "#555",
            flex: 1,
            lineHeight: 20,
          }}
        >
          {f}
        </Text>
      </View>
    ))}
    <Pressable
      onPress={onSubscribe}
      disabled={subscribing}
      style={({ pressed }) => ({
        backgroundColor: plan.color,
        borderRadius: 12,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Text
        style={{ fontFamily: "Inter_700Bold", fontSize: 15, color: "#fffff0" }}
      >
        {subscribing
          ? "Processing…"
          : `Subscribe — ₦${formatNumberToThousands(plan.price)}`}
      </Text>
    </Pressable>
  </View>
);

const Subscription = () => {
  const [user, setUser] = useState<any>(null);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const { data: wallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : ""
  );

  const { postData } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/deduct`
  );

  const handleSubscribe = (plan: (typeof PLANS)[0]) => {
    if (!wallet || wallet.balance < plan.price) {
      Alert.alert(
        "Insufficient Balance",
        `You need ₦${formatNumberToThousands(
          plan.price
        )} to subscribe. Your balance is ₦${formatNumberToThousands(
          wallet?.balance ?? 0
        )}. Fund or loan your wallet.`,
        [
          { text: "Fund Wallet", onPress: () => router.push("/clientWallet") },
          { text: "Collect Loan", onPress: () => router.push("/collectLoan") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    Alert.alert(
      `Subscribe to ${plan.label}?`,
      `₦${formatNumberToThousands(
        plan.price
      )} will be deducted from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setSubscribingId(plan.id);
            try {
              await postData({
                amount: plan.price,
                description: `${plan.label} subscription`,
              });
              Toast.show({
                type: "success",
                text1: `${plan.label} activated!`,
                text2: "Enjoy your premium access.",
                position: "bottom",
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Failed",
                text2: err?.message,
                position: "bottom",
              });
            } finally {
              setSubscribingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 32,
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
          Premium Plans
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Unlock unlimited access to all services
        </Text>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "rgba(255,255,240,0.65)",
            }}
          >
            Wallet Balance:
          </Text>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 14,
              color: "#fffff0",
            }}
          >
            ₦{formatNumberToThousands(wallet?.balance ?? 0)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSubscribe={() => handleSubscribe(plan)}
            subscribing={subscribingId === plan.id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Subscription;
