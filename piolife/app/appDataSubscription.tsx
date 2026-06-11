// app/appDataSubscription.tsx — PRD: "Subscribe (App Data)" — always online feature
import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const DATA_PLANS = [
  {
    id: "daily",
    name: "Daily App Data",
    price: "₦50",
    duration: "24 hours",
    gb: "500MB",
    popular: false,
  },
  {
    id: "weekly",
    name: "Weekly App Data",
    price: "₦200",
    duration: "7 days",
    gb: "2GB",
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly App Data",
    price: "₦500",
    duration: "30 days",
    gb: "10GB",
    popular: false,
  },
  {
    id: "yearly",
    name: "Annual App Data",
    price: "₦5,000",
    duration: "365 days",
    gb: "Unlimited",
    popular: false,
  },
];

const PROVIDERS = [
  { name: "MTN", color: "#F8A200", ussd: "*904#" },
  { name: "Airtel", color: "#E3001B", ussd: "*141#" },
  { name: "Glo", color: "#2B8F20", ussd: "*777#" },
  { name: "9mobile", color: "#006B3F", ussd: "*200#" },
];

const AppDataSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedProvider) {
      Toast.show({
        type: "error",
        text1: "Select a plan and provider first",
        position: "bottom",
      });
      return;
    }
    const provider = PROVIDERS.find((p) => p.name === selectedProvider);
    if (provider?.ussd) {
      try {
        await Linking.openURL(`tel:${encodeURIComponent(provider.ussd)}`);
      } catch {
        Toast.show({
          type: "error",
          text1: "Could not open dialer",
          position: "bottom",
        });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" />
      <Toast />

      <View
        style={{
          backgroundColor: "#0E16FF",
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
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          App Data
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 6,
          }}
        >
          Stay connected to PioLife 24/7 with dedicated app data
        </Text>
      </View>

      <View style={{ padding: 20, gap: 20, flex: 1 }}>
        {/* Plans */}
        <View>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#272757",
              marginBottom: 12,
            }}
          >
            Select Plan
          </Text>
          <View style={{ gap: 10 }}>
            {DATA_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <Pressable
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: isSelected ? "#0E16FF" : "#fff",
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1.5,
                    borderColor: isSelected ? "#0E16FF" : "#E0E0E0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: isSelected ? "#fffff0" : "#0E16FF",
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
                    <View>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 14,
                          color: isSelected ? "#fffff0" : "#272757",
                        }}
                      >
                        {plan.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                          color: isSelected ? "rgba(255,255,240,0.7)" : "#888",
                        }}
                      >
                        {plan.gb} · {plan.duration}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {plan.popular && (
                      <View
                        style={{
                          backgroundColor: "#fffff0",
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 10,
                            color: "#0E16FF",
                          }}
                        >
                          POPULAR
                        </Text>
                      </View>
                    )}
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 15,
                        color: isSelected ? "#fffff0" : "#0E16FF",
                      }}
                    >
                      {plan.price}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Provider */}
        <View>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#272757",
              marginBottom: 12,
            }}
          >
            Select Provider
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {PROVIDERS.map((p) => (
              <Pressable
                key={p.name}
                onPress={() => setSelectedProvider(p.name)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor:
                    selectedProvider === p.name ? p.color : "#fff",
                  borderWidth: 1.5,
                  borderColor:
                    selectedProvider === p.name ? p.color : "#E0E0E0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 13,
                    color: selectedProvider === p.name ? "#fff" : "#272757",
                  }}
                >
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleSubscribe}
          style={({ pressed }) => ({
            backgroundColor: "#0E16FF",
            borderRadius: 14,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
            marginTop: "auto",
          })}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "#fffff0",
            }}
          >
            Subscribe Now
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AppDataSubscription;
