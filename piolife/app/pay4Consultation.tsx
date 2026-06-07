/**
 * app/pay4Consultation.tsx — REWRITTEN
 *
 * FIXES:
 *  1. Balance check before allowing payment (was missing)
 *  2. Wallet deduction actually happens before navigating to call
 *  3. Privacy warning shown AFTER successful payment per prototype
 *  4. Specialty indicators with availability (green/red dot)
 *  5. ₦1,500 per health issue selected (per prototype)
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const COST_PER_ISSUE = 1500;

const Pay4Consultation = () => {
  const params = useLocalSearchParams<{
    issues: string;
    issueIds: string;
    callType: string;
    language: string;
  }>();

  const [user, setUser] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  const issueNames: string[] = params.issues ? JSON.parse(params.issues) : [];
  const issueIds: string[] = params.issueIds ? JSON.parse(params.issueIds) : [];
  const callType = params.callType ?? "video";
  const language = params.language ?? "English";

  const totalCost = issueNames.length * COST_PER_ISSUE;

  const { data: wallet, refetch: refetchWallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  // Find matching practitioners for these issues
  const { data: practitioners, loading: loadingDocs } = useFetchData<any[]>(
    user
      ? `${API_URL}/api/v12/sessions/practitioners?issueIds=${issueIds.join(
          ","
        )}&language=${language}`
      : "",
    { token }
  );

  const { postData: deductWallet } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/deduct`
  );

  const handlePay = async () => {
    if (!wallet || wallet.balance < totalCost) {
      Alert.alert(
        "Insufficient Balance",
        `You need ₦${formatNumberToThousands(
          totalCost
        )} for this consultation.\nYour wallet: ₦${formatNumberToThousands(
          wallet?.balance ?? 0
        )}`,
        [
          { text: "Fund Wallet", onPress: () => router.push("/clientWallet") },
          { text: "Collect Loan", onPress: () => router.push("/collectLoan") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `₦${formatNumberToThousands(totalCost)} will be deducted for ${
        issueNames.length
      } health issue(s). Proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: async () => {
            setPaying(true);
            try {
              await deductWallet({
                amount: totalCost,
                description: `Consultation: ${issueNames.join(", ")}`,
              });
              refetchWallet();
              setPaid(true);

              // Per prototype: privacy warning after successful payment
              Alert.alert(
                "⚠️ Privacy Notice",
                "Do NOT disclose your mobile number, email, or residential address to the consultant. Piolife will not be held responsible for any eventuality resulting from sharing your personal data.",
                [{ text: "I Understand", style: "default" }]
              );
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Payment failed",
                text2: err?.message,
                position: "bottom",
              });
            } finally {
              setPaying(false);
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

      {/* Header */}
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
            fontSize: 24,
            color: "#fffff0",
          }}
        >
          Confirm & Pay
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Review your consultation details below
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: paid ? 40 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#888",
              marginBottom: 12,
            }}
          >
            CONSULTATION SUMMARY
          </Text>

          {/* Selected issues */}
          <View style={{ gap: 8, marginBottom: 16 }}>
            {issueNames.map((name, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#0E16FF",
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#272757",
                    flex: 1,
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                    color: "#0E16FF",
                  }}
                >
                  ₦{formatNumberToThousands(COST_PER_ISSUE)}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{ height: 1, backgroundColor: "#F0F0F0", marginBottom: 12 }}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#888",
              }}
            >
              Call Type
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#272757",
              }}
            >
              {callType === "video" ? "📹 Video" : "📞 Voice"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#888",
              }}
            >
              Language
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#272757",
              }}
            >
              {language}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#888",
              }}
            >
              Wallet Balance
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#272757",
              }}
            >
              ₦{formatNumberToThousands(wallet?.balance ?? 0)}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F0",
              marginVertical: 12,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#272757",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 22,
                color: "#0E16FF",
              }}
            >
              ₦{formatNumberToThousands(totalCost)}
            </Text>
          </View>
        </View>

        {paid ? (
          <>
            {/* After payment: show available practitioners */}
            <View
              style={{
                backgroundColor: "#ECFDF5",
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: "#16A34A",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: "#166534",
                }}
              >
                ✅ Payment successful! Select a doctor below.
              </Text>
            </View>

            {/* Issue tags with availability dots */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {issueNames.map((name, i) => {
                const hasDoctors =
                  Array.isArray(practitioners) && practitioners.length > 0;
                return (
                  <Pressable
                    key={i}
                    onPress={() => (hasDoctors ? null : null)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: hasDoctors ? "#16A34A" : "#B91C1C",
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 13,
                        color: "#272757",
                      }}
                    >
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Available practitioners */}
            {loadingDocs ? (
              <ActivityIndicator color="#0E16FF" />
            ) : !practitioners || practitioners.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: 14,
                  padding: 16,
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
                  🔴 No doctors available right now
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    color: "#7F1D1D",
                  }}
                >
                  All doctors for your specialty are currently busy. Please
                  check back shortly.
                </Text>
              </View>
            ) : (
              practitioners.map((doc: any) => (
                <Pressable
                  key={doc._id}
                  onPress={() =>
                    router.push({
                      pathname: "/call",
                      params: {
                        doctorId: doc._id,
                        type: callType,
                        specialtyId: issueIds[0],
                      },
                    })
                  }
                  style={({ pressed }) => ({
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    shadowColor: "#272757",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    opacity: pressed ? 0.92 : 1,
                  })}
                >
                  <View style={{ position: "relative" }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#EEF0FF",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="user" size={24} color="#0E16FF" />
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: doc.isOnline ? "#16A34A" : "#B91C1C",
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 15,
                        color: "#272757",
                      }}
                    >
                      Dr. {doc.firstName} {doc.lastName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: "#888",
                        marginTop: 2,
                      }}
                    >
                      ID: {doc.username ?? "—"}
                    </Text>
                    {Array.isArray(doc.languageProficiency) && (
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 11,
                          color: "#0E16FF",
                          marginTop: 2,
                        }}
                      >
                        {doc.languageProficiency.join(", ")}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "center", gap: 4 }}>
                    {callType === "video" ? (
                      <Feather name="video" size={20} color="#0E16FF" />
                    ) : (
                      <Feather name="phone" size={20} color="#0E16FF" />
                    )}
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 10,
                        color: "#0E16FF",
                      }}
                    >
                      {doc.isOnline ? "Available" : "Busy"}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Sticky Pay button — always visible at bottom */}
      {!paid && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fffff0",
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === "android" ? 20 : 30,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(39,39,87,0.08)",
          }}
        >
          <Pressable
            onPress={handlePay}
            disabled={paying}
            style={({ pressed }) => ({
              backgroundColor: paying ? "#7B83FF" : "#0E16FF",
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
            {paying ? (
              <ActivityIndicator color="#fffff0" />
            ) : (
              <Text
                style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#fffff0" }}
              >
                Pay ₦{formatNumberToThousands(totalCost)}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Pay4Consultation;
