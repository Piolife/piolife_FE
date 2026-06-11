/**
 * app/medLabTests.tsx — REWRITTEN
 *
 * FIXES:
 *  1. Race condition: location state no longer gates the fetch URL
 *  2. Shows correct lab test list for the chosen lab (by labId param)
 *  3. Auto-highlights tests matching doctor's diagnostic note
 *  4. Wallet balance check before payment
 *  5. Sends order notification to lab on payment
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const MedLabTests = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  // FIX: fetch by lab ID directly — no location gating
  const { data: tests, loading } = useFetchData<any[]>(
    id ? `${API_URL}/api/v12/medlab-stock/user/${id}` : "",
    { token }
  );

  const { data: wallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  // Doctor's diagnostic note — auto-highlight matching tests
  const { data: prescriptions } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/sessions/prescriptions/user/${user.id}` : "",
    { token }
  );
  const diagnosis =
    Array.isArray(prescriptions) && prescriptions.length > 0
      ? prescriptions[prescriptions.length - 1]?.diagnosis ?? ""
      : "";

  const { loading: ordering, postData } = usePostData(
    `${API_URL}/api/v12/medlab-stock/orders`,
    true
  );

  const toggle = (testId: string) => {
    setSelected((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  const selectedItems = tests ? tests.filter((t: any) => selected[t._id]) : [];
  const totalCost = selectedItems.reduce(
    (s: number, t: any) => s + (t.price ?? 0),
    0
  );

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Select at least one test",
        position: "bottom",
      });
      return;
    }
    if (!wallet || wallet.balance < totalCost) {
      Alert.alert(
        "Insufficient Balance",
        `You need ₦${formatNumberToThousands(
          totalCost
        )} for these tests.\nYour balance: ₦${formatNumberToThousands(
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
      "Confirm Booking",
      `Book ${selectedItems.length} test(s) for ₦${formatNumberToThousands(
        totalCost
      )}?\n₦${formatNumberToThousands(
        totalCost
      )} will be deducted from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm & Pay",
          onPress: async () => {
            try {
              await postData({
                testIds: selectedItems.map((t: any) => t._id),
                userId: user?.id,
                labId: id,
                diagnosisNote: diagnosis,
              });
              Toast.show({
                type: "success",
                text1: "Tests booked!",
                text2:
                  "The lab has been notified with your diagnostic details.",
                position: "bottom",
              });
              setSelected({});
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Booking failed",
                text2: err?.message,
                position: "bottom",
              });
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffff0",
        }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 28,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 22,
            color: "#fffff0",
          }}
        >
          {name ?? "Medical Lab"}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Select tests · Wallet: ₦
          {formatNumberToThousands(wallet?.balance ?? 0)}
        </Text>

        {diagnosis ? (
          <View
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 11,
                color: "#fffff0",
                marginBottom: 2,
              }}
            >
              🩺 Doctor's diagnostic note (shared with lab):
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.85)",
              }}
              numberOfLines={2}
            >
              {diagnosis}
            </Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={tests ?? []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 36 }}>🔬</Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginTop: 12,
              }}
            >
              No tests listed
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#888",
                marginTop: 6,
              }}
            >
              This lab hasn't added any tests yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isHighlighted = diagnosis
            .toLowerCase()
            .includes(item.name?.toLowerCase());
          return (
            <Pressable
              onPress={() => toggle(item._id)}
              style={({ pressed }) => ({
                backgroundColor: isHighlighted ? "#F5F3FF" : "#fff",
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                borderWidth: isHighlighted ? 1.5 : 0.5,
                borderColor: isHighlighted ? "#7C3AED" : "#F0F0F0",
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Checkbox
                value={!!selected[item._id]}
                onValueChange={() => toggle(item._id)}
                color="#7C3AED"
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#272757",
                    }}
                  >
                    {item.name}
                  </Text>
                  {isHighlighted && (
                    <View
                      style={{
                        backgroundColor: "#7C3AED",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 9,
                          color: "#fff",
                        }}
                      >
                        RECOMMENDED
                      </Text>
                    </View>
                  )}
                </View>
                {item.description ? (
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      color: "#888",
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.description}
                  </Text>
                ) : null}
                {item.homeService && (
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 11,
                      color: "#7C3AED",
                      marginTop: 2,
                    }}
                  >
                    🏠 Home service available
                  </Text>
                )}
              </View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 14,
                  color: "#7C3AED",
                }}
              >
                ₦{formatNumberToThousands(item.price)}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Floating pay button */}
      {selectedItems.length > 0 && (
        <View style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <Pressable
            onPress={handleOrder}
            disabled={ordering}
            style={({ pressed }) => ({
              backgroundColor: ordering ? "#A78BFA" : "#7C3AED",
              borderRadius: 14,
              height: 58,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: pressed ? 0.88 : 1,
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
              elevation: 8,
            })}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#fffff0",
              }}
            >
              {ordering
                ? "Booking…"
                : `Pay ₦${formatNumberToThousands(totalCost)} · Book ${
                    selectedItems.length
                  } Test${selectedItems.length > 1 ? "s" : ""}`}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MedLabTests;
