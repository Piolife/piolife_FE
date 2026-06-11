// app/vipSubscription.tsx — PRD: VIP/VVIP/Health Insurance subscription tiers
import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIERS = [
  {
    id: "vip",
    name: "VIP",
    price: 100_000,
    period: "per year",
    color: "#0E16FF",
    badge: "💎",
    features: [
      "Unlimited consultations for 1 year",
      "Priority doctor matching",
      "Access to all specialist categories",
      "Medical history stored indefinitely",
      "Prescription delivery discounts",
    ],
  },
  {
    id: "vvip",
    name: "VVIP",
    price: 300_000,
    period: "per year",
    color: "#272757",
    badge: "👑",
    features: [
      "Everything in VIP",
      "Unlimited emergency response for 1 year",
      "Dedicated case manager",
      "Real-time ambulance tracking",
      "Priority lab and pharmacy services",
    ],
  },
  {
    id: "health_insurance",
    name: "Health Shield",
    price: 50_000,
    period: "per month",
    color: "#1D6A3A",
    badge: "🛡️",
    features: [
      "Monthly health insurance cover",
      "Eligible for surgery cover after 1 year",
      "No pre-existing surgery conditions covered",
      "Covered for major illnesses",
      "Seamless claims via the app",
    ],
    note: "Condition: No awaiting medical surgery at time of subscription",
  },
];

const VIPSubscription = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      const res = await fetch(`${API_URL}/api/v12/wallet/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id, tier: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Subscribed!",
          text2: "Your subscription is now active.",
          position: "bottom",
        });
        setTimeout(() => router.back(), 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: data.message ?? "Insufficient balance or error",
          position: "bottom",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not complete subscription",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" />
      <Toast />
      <View
        style={{
          backgroundColor: "#272757",
          paddingTop: Platform.OS === "android" ? 28 : 12,
          paddingBottom: 36,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_300Light",
            fontSize: 12,
            color: "rgba(255,255,240,0.6)",
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Premium
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 28,
            color: "#fffff0",
          }}
        >
          Choose Your Plan
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.65)",
            marginTop: 6,
          }}
        >
          Deducted directly from your PioWallet
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 100,
        }}
      >
        {TIERS.map((tier) => {
          const isSelected = selected === tier.id;
          return (
            <Pressable
              key={tier.id}
              onPress={() => setSelected(tier.id)}
              style={({ pressed }) => ({
                backgroundColor: isSelected ? tier.color : "#fff",
                borderRadius: 20,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: isSelected ? tier.color : "rgba(39,39,87,0.08)",
                opacity: pressed ? 0.94 : 1,
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: isSelected ? 8 : 3 },
                shadowOpacity: isSelected ? 0.18 : 0.06,
                shadowRadius: isSelected ? 20 : 10,
                elevation: isSelected ? 8 : 3,
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 26 }}>{tier.badge}</Text>
                  <Text
                    style={{
                      fontFamily: "Inter_800ExtraBold",
                      fontSize: 20,
                      color: isSelected ? "#fffff0" : "#272757",
                    }}
                  >
                    {tier.name}
                  </Text>
                </View>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: isSelected ? "#fffff0" : tier.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#fffff0",
                      }}
                    />
                  )}
                </View>
              </View>
              <View style={{ marginBottom: 14 }}>
                <Text
                  style={{
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 26,
                    color: isSelected ? "#fffff0" : tier.color,
                  }}
                >
                  ₦{tier.price.toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: isSelected ? "rgba(255,255,240,0.7)" : "#888",
                  }}
                >
                  {tier.period}
                </Text>
              </View>
              {tier.features.map((f, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <Feather
                    name="check-circle"
                    size={14}
                    color={isSelected ? "#fffff0" : tier.color}
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: isSelected ? "rgba(255,255,240,0.9)" : "#555",
                      flex: 1,
                    }}
                  >
                    {f}
                  </Text>
                </View>
              ))}
              {tier.note && (
                <View
                  style={{
                    marginTop: 10,
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.15)"
                      : "#FFF8E7",
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 11,
                      color: isSelected ? "rgba(255,255,240,0.8)" : "#B45309",
                    }}
                  >
                    ⚠️ {tier.note}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {selected && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: "#fffff0",
            borderTopWidth: 1,
            borderTopColor: "rgba(39,39,87,0.08)",
          }}
        >
          <Pressable
            onPress={handleSubscribe}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: "#0E16FF",
              borderRadius: 14,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed || loading ? 0.85 : 1,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#fffff0" />
            ) : (
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#fffff0",
                }}
              >
                Subscribe Now
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VIPSubscription;
