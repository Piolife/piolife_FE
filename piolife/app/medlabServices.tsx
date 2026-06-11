/**
 * app/medlabServices.tsx — REWRITTEN
 *
 * Lab provider's order management dashboard.
 * FIX: Same location-gate bug as pharmServices — fixed.
 * Shows incoming patient orders with doctor's diagnostic note.
 * Credit Me flow matches prototype.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";

const MedlabServices = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  // FIX: gated only on user — no location race condition
  const { data: orders, loading } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/medlab-stock/orders/${user.id}` : "",
    { token }
  );

  const { data: wallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

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

  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((s: number, o: any) => s + (o.totalAmount ?? 0), 0)
    : 0;

  const pendingCount = Array.isArray(orders)
    ? orders.filter((o: any) => o.status === "pending").length
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />

      <View
        style={{
          backgroundColor: "#7C3AED",
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
          Lab Services
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.7)",
                marginBottom: 4,
              }}
            >
              Revenue
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#fffff0",
              }}
            >
              ₦{formatNumberToThousands(totalRevenue)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.7)",
                marginBottom: 4,
              }}
            >
              Pending
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#fffff0",
              }}
            >
              {pendingCount}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.7)",
                marginBottom: 4,
              }}
            >
              Wallet
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#fffff0",
              }}
            >
              ₦{formatNumberToThousands(wallet?.balance ?? 0)}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={Array.isArray(orders) ? orders : []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#272757",
              }}
            >
              Patient Orders
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => router.push("/tests")}
                style={{
                  backgroundColor: "#7C3AED",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 12,
                    color: "#fffff0",
                  }}
                >
                  Manage Tests
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/creditMe")}
                style={{
                  backgroundColor: "#272757",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 12,
                    color: "#fffff0",
                  }}
                >
                  Credit Me
                </Text>
              </Pressable>
            </View>
          </View>
        }
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
              No orders yet
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#888",
                marginTop: 6,
              }}
            >
              Patient lab orders will appear here
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: "#272757",
                }}
              >
                Order #{item._id?.slice(-6).toUpperCase()}
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor:
                    item.status === "pending" ? "#FEF3C7" : "#DCFCE7",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 11,
                    color: item.status === "pending" ? "#B45309" : "#16A34A",
                  }}
                >
                  {(item.status ?? "pending").toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Doctor's diagnostic note shown to lab */}
            {item.diagnosisNote && (
              <View
                style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 11,
                    color: "#7C3AED",
                    marginBottom: 2,
                  }}
                >
                  🩺 Doctor's Diagnostic Note:
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#4C1D95",
                  }}
                >
                  {item.diagnosisNote}
                </Text>
              </View>
            )}

            {Array.isArray(item.tests) &&
              item.tests.map((t: any, i: number) => (
                <Text
                  key={i}
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    color: "#555",
                  }}
                >
                  • {t.name ?? t}
                </Text>
              ))}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 14,
                  color: "#7C3AED",
                }}
              >
                ₦{formatNumberToThousands(item.totalAmount ?? 0)}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#888",
                }}
              >
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-NG")
                  : ""}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MedlabServices;
