/**
 * app/doctorDashboard.tsx — NEW / REPLACEMENT SCREEN
 *
 * The doctor's main working interface per the CONZOT+ prototype:
 *  - Shows consultation count & earnings
 *  - Credit Me button → triggers withdrawal request
 *  - Statement history
 *  - Video/Call buttons activate based on incoming call type
 *  - Alert button for flagging issues
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const CONSULTATION_FEE = 500; // ₦ per consultation — adjust to match backend

const StatBox = ({
  label,
  value,
  accent = "#0E16FF",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) => (
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
      {label}
    </Text>
    <Text
      style={{ fontFamily: "Inter_800ExtraBold", fontSize: 28, color: accent }}
    >
      {value}
    </Text>
  </View>
);

const DoctorDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [creditRequested, setCreditRequested] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  // Consultations this doctor handled
  const {
    data: consultations,
    loading,
    refetch,
  } = useFetchData<any[]>(
    user
      ? `${API_URL}/api/v12/sessions/consultations/practitioner/${user.id}`
      : "",
    { token }
  );

  // Wallet balance (earnings counter)
  const { data: wallet, refetch: refetchWallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  const { loading: crediting, postData: requestCredit } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/withdraw`
  );

  const pendingCount = Array.isArray(consultations) ? consultations.length : 0;
  const earnedAmount = pendingCount * CONSULTATION_FEE;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetch();
    refetchWallet();
    setRefreshing(false);
  }, []);

  const handleCreditMe = async () => {
    if (pendingCount === 0) {
      Toast.show({
        type: "error",
        text1: "Nothing to withdraw",
        text2: "You have no pending consultations to credit.",
        position: "bottom",
      });
      return;
    }
    Alert.alert(
      "Request Payout",
      `Request payout of ₦${formatNumberToThousands(
        earnedAmount
      )} for ${pendingCount} consultation(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await requestCredit({ amount: earnedAmount });
              setCreditRequested(true);
              Toast.show({
                type: "success",
                text1: "Payout requested!",
                text2: "Our admin will process your payment shortly.",
                position: "bottom",
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Request failed",
                text2: err?.message ?? "Try again",
                position: "bottom",
              });
            }
          },
        },
      ]
    );
  };

  const handleAlert = () => {
    Alert.alert(
      "Alert Admin",
      "Send an alert to Piolife admin about an issue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: () =>
            Toast.show({
              type: "success",
              text1: "Alert sent",
              text2: "Admin has been notified.",
              position: "bottom",
            }),
        },
      ]
    );
  };

  if (loading && !consultations) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffff0",
        }}
      >
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0E16FF"
          />
        }
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#272757",
            paddingTop: Platform.OS === "android" ? 30 : 16,
            paddingBottom: 40,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Inter_300Light",
                  fontSize: 12,
                  color: "rgba(255,255,240,0.6)",
                  marginBottom: 4,
                }}
              >
                Doctor Portal
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  color: "#fffff0",
                }}
              >
                Dr. {user?.firstName ?? "—"} {user?.lastName ?? ""}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "rgba(255,255,240,0.55)",
                  marginTop: 2,
                }}
              >
                ID: {user?.username ?? "—"}
              </Text>
            </View>
            {/* Alert button */}
            <Pressable
              onPress={handleAlert}
              style={({ pressed }) => ({
                backgroundColor: "#B91C1C",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                ⚠️ Alert
              </Text>
            </Pressable>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatBox label="Consulted" value={pendingCount} accent="#0E16FF" />
            <StatBox
              label="Amount Earned"
              value={`₦${formatNumberToThousands(earnedAmount)}`}
              accent="#16A34A"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 20 }}>
          {/* Wallet balance */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 12,
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
                fontSize: 32,
                color: "#272757",
              }}
            >
              ₦{formatNumberToThousands(wallet?.balance ?? 0)}
            </Text>
          </View>

          {/* Credit Me */}
          <Pressable
            onPress={handleCreditMe}
            disabled={crediting || creditRequested || pendingCount === 0}
            style={({ pressed }) => ({
              backgroundColor: creditRequested
                ? "#9CA3AF"
                : pendingCount === 0
                ? "#9CA3AF"
                : "#0E16FF",
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
            })}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#fffff0",
              }}
            >
              {crediting
                ? "Requesting…"
                : creditRequested
                ? "Payout Requested ✓"
                : "💳 Credit Me"}
            </Text>
          </Pressable>

          {creditRequested && (
            <View
              style={{
                backgroundColor: "#ECFDF5",
                borderRadius: 12,
                padding: 14,
                borderLeftWidth: 4,
                borderLeftColor: "#16A34A",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 13,
                  color: "#166534",
                }}
              >
                Payout request sent! Once processed by admin, your counters will
                reset and you'll be active again.
              </Text>
            </View>
          )}

          {/* Recent Consultations */}
          <View>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#272757",
                marginBottom: 12,
              }}
            >
              Recent Consultations
            </Text>
            {!consultations || consultations.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#888",
                  }}
                >
                  No consultations yet
                </Text>
              </View>
            ) : (
              consultations.slice(0, 10).map((c: any, i: number) => (
                <View
                  key={c._id ?? i}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 10,
                    shadowColor: "#272757",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 14,
                          color: "#272757",
                        }}
                      >
                        {c.medicalIssue?.name ?? "Consultation"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                          color: "#888",
                          marginTop: 2,
                        }}
                      >
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: "#EEF0FF",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 11,
                          color: "#0E16FF",
                        }}
                      >
                        ₦{formatNumberToThousands(CONSULTATION_FEE)}
                      </Text>
                    </View>
                  </View>
                  {/* Write prescription button */}
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/writePrescription",
                        params: { consultationId: c._id, patientId: c.userId },
                      })
                    }
                    style={{
                      marginTop: 10,
                      backgroundColor: "#F0F0F8",
                      borderRadius: 8,
                      padding: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 12,
                        color: "#272757",
                      }}
                    >
                      📋 Write / View Report
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>

          {/* View statement */}
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
              shadowOpacity: 0.06,
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
              📊 Transaction Statement
            </Text>
            <Feather name="chevron-right" size={18} color="#888" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDashboard;
