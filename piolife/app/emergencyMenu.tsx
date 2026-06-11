/**
 * app/emergencyMenu.tsx — REWRITTEN
 *
 * Per prototype:
 * - Auto-debit wallet on emergency request
 * - If insufficient balance → alert with fund/loan options
 * - Captures location and fills emergency form
 * - Dispatches to nearest ambulance service
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import {
  getCurrentLocation,
  formatNumberToThousands,
} from "@/components/reusables";
import Toast from "react-native-toast-message";

const EMERGENCY_COST = 5000; // ₦5,000 per prototype

const LANDMARKS = [
  "Bus Stop",
  "Church",
  "Mosque",
  "Market",
  "Plaza",
  "Fuel Station",
  "Other",
];
const INCIDENTS = [
  "Fire",
  "Acid Attack",
  "Drowning",
  "Auto Crash",
  "Gas Leak",
  "Other",
];

const EmergencyMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [step, setStep] = useState<"info" | "form">("info");
  const [form, setForm] = useState({
    landmark: "",
    incidentType: "",
    locationDesc: "",
    otherLandmark: "",
    otherIncident: "",
  });
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;
  const { data: wallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token },
  );
  const { loading: dispatching, postData } = usePostData(
    `${API_URL}/api/v12/emergency-stock/emergencies`,
    true,
  );

  const checkBalanceAndProceed = () => {
    if (!wallet || wallet.balance < EMERGENCY_COST) {
      Alert.alert(
        "Insufficient Balance",
        `Emergency service costs ₦${formatNumberToThousands(
          EMERGENCY_COST,
        )}. Your balance: ₦${formatNumberToThousands(
          wallet?.balance ?? 0,
        )}.\n\nFund or loan your wallet to continue.`,
        [
          { text: "Fund Wallet", onPress: () => router.push("/clientWallet") },
          { text: "Collect Loan", onPress: () => router.push("/collectLoan") },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }

    // Ask if at location
    Alert.alert(
      "Are you at the emergency location?",
      "If YES, we'll use your GPS. If NO, please fill in the location details.",
      [
        {
          text: "Yes, I'm at the location",
          onPress: async () => {
            setLocating(true);
            try {
              const coords = await getCurrentLocation();
              setLocation(coords);
              handleDispatch(coords);
            } catch {
              Toast.show({
                type: "error",
                text1: "Location failed",
                text2: "Please fill the form instead.",
                position: "bottom",
              });
              setStep("form");
            } finally {
              setLocating(false);
            }
          },
        },
        { text: "No, I'll fill the form", onPress: () => setStep("form") },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleDispatch = async (coords?: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      await postData({
        userId: user?.id,
        latitude: coords?.latitude ?? location?.latitude,
        longitude: coords?.longitude ?? location?.longitude,
        landmark:
          form.landmark === "Other" ? form.otherLandmark : form.landmark,
        incidentType:
          form.incidentType === "Other"
            ? form.otherIncident
            : form.incidentType,
        locationDescription: form.locationDesc,
        cost: EMERGENCY_COST,
      });
      Alert.alert(
        "🚑 Emergency Dispatched!",
        "Nearest ambulance has been notified and is on its way.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (err: any) {
      Alert.alert(
        "Dispatch Failed",
        err?.message || "Unable to dispatch. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (dispatching || locating) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#B91C1C",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 16,
            color: "#fff",
            marginTop: 20,
          }}
        >
          {locating ? "Getting your location…" : "Dispatching ambulance…"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fffff0", flexDirection: "column" }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <View
        style={{
          backgroundColor: "#B91C1C",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 32,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable
          onPress={() => (step === "form" ? setStep("info") : router.back())}
          style={{ marginBottom: 20 }}
        >
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          🚑 Emergency
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Service cost: ₦{formatNumberToThousands(EMERGENCY_COST)} · Wallet: ₦
          {formatNumberToThousands(wallet?.balance ?? 0)}
        </Text>
      </View>

      {step === "info" ? (
        <View style={{ flex: 1, justifyContent: "space-between", padding: 24, paddingBottom: Platform.OS === "android" ? 24 : 34 }}>
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 16,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#B91C1C",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: "#B91C1C",
                marginBottom: 4,
              }}
            >
              ⚠️ Important Notice
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#7F1D1D",
                lineHeight: 20,
              }}
            >
              Your wallet will be debited ₦
              {formatNumberToThousands(EMERGENCY_COST)} immediately. Nearest
              ambulance will be automatically dispatched to your location.
            </Text>
          </View>

          <Pressable
            onPress={checkBalanceAndProceed}
            style={{
              backgroundColor: "#B91C1C",
              borderRadius: 14,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
              elevation: 10,
            }}
          >
            <Feather name="alert-circle" size={22} color="#fffff0" />
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 17,
                color: "#fffff0",
              }}
            >
              Request Ambulance Now
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#272757",
                marginBottom: 16,
              }}
            >
              Emergency Details
            </Text>

            {/* Location description */}
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#272757",
                marginBottom: 6,
              }}
            >
              Describe the location
            </Text>
            <TextInput
              value={form.locationDesc}
              onChangeText={(v) => setForm((p) => ({ ...p, locationDesc: v }))}
              placeholder="e.g. No 5 Aba Road, opposite the school gate…"
              placeholderTextColor="#C0C0C0"
              multiline
              style={{
                borderWidth: 1.5,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 14,
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#272757",
                minHeight: 72,
                marginBottom: 20,
                backgroundColor: "#fff",
              }}
            />

            {/* Landmark */}
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#272757",
                marginBottom: 10,
              }}
            >
              Closest Landmark
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {LANDMARKS.map((l) => (
                <Pressable
                  key={l}
                  onPress={() => setForm((p) => ({ ...p, landmark: l }))}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: form.landmark === l ? "#B91C1C" : "#fff",
                    borderWidth: 1,
                    borderColor: form.landmark === l ? "#B91C1C" : "#E0E0E0",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 13,
                      color: form.landmark === l ? "#fff" : "#272757",
                    }}
                  >
                    {l}
                  </Text>
                </Pressable>
              ))}
            </View>
            {form.landmark === "Other" && (
              <TextInput
                value={form.otherLandmark}
                onChangeText={(v) =>
                  setForm((p) => ({ ...p, otherLandmark: v }))
                }
                placeholder="Specify landmark"
                placeholderTextColor="#C0C0C0"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#272757",
                  marginBottom: 16,
                  backgroundColor: "#fff",
                }}
              />
            )}

            {/* Incident type */}
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#272757",
                marginBottom: 10,
              }}
            >
              Nature of Incident
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {INCIDENTS.map((i) => (
                <Pressable
                  key={i}
                  onPress={() => setForm((p) => ({ ...p, incidentType: i }))}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      form.incidentType === i ? "#B91C1C" : "#fff",
                    borderWidth: 1,
                    borderColor:
                      form.incidentType === i ? "#B91C1C" : "#E0E0E0",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 13,
                      color: form.incidentType === i ? "#fff" : "#272757",
                    }}
                  >
                    {i}
                  </Text>
                </Pressable>
              ))}
            </View>
            {form.incidentType === "Other" && (
              <TextInput
                value={form.otherIncident}
                onChangeText={(v) =>
                  setForm((p) => ({ ...p, otherIncident: v }))
                }
                placeholder="Specify incident type"
                placeholderTextColor="#C0C0C0"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#272757",
                  marginBottom: 16,
                  backgroundColor: "#fff",
                }}
              />
            )}
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#fffff0",
              paddingHorizontal: 20,
              paddingBottom: Platform.OS === "android" ? 24 : 34,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(185,28,28,0.1)",
            }}
          >
            <Pressable
              onPress={() => handleDispatch()}
              disabled={!form.incidentType || !form.locationDesc}
              style={{
                backgroundColor:
                  !form.incidentType || !form.locationDesc ? "#9CA3AF" : "#B91C1C",
                borderRadius: 14,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#ffffff",
                }}
              >
                🚑 Dispatch Ambulance
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EmergencyMenu;
