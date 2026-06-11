// FIXED app/pharmServices.tsx
// Bug: used `location` (browser window object, undefined in RN) to gate API call — data never loaded
// Fix: gate on user loading, not location. Show sales + prescriptions received
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import {
  formatNumberToThousands,
  formatDateTime,
} from "@/components/reusables";
import Toast from "react-native-toast-message";

const PharmServices = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  // FIXED: was gated on `location` (undefined), now gated on user
  const { data: salesData, loading: salesLoading } = useFetchData<any>(
    user ? `${API_URL}/api/v12/pharmacy-stock/sales/${user.id}` : "",
    { token }
  );

  // Prescriptions sent to this pharmacy
  const {
    data: prescriptions,
    loading: presLoading,
    refetch,
  } = useFetchData<any[]>(
    user
      ? `${API_URL}/api/v12/sessions/prescriptions/practitioner/${user.id}`
      : "",
    { token }
  );

  const loading = salesLoading || presLoading;

  const totalSales = Array.isArray(salesData)
    ? salesData.reduce((sum: number, s: any) => sum + (s.totalAmount ?? 0), 0)
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" />
      <Toast />

      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 28 : 12,
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
            fontFamily: "Inter_300Light",
            fontSize: 12,
            color: "rgba(255,255,240,0.65)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Pharmacy
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          Services
        </Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0E16FF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 80,
          }}
        >
          {/* Total sales card */}
          <View
            style={{
              backgroundColor: "#0E16FF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
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
              Total Sales Revenue
            </Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 30,
                color: "#fffff0",
              }}
            >
              ₦{formatNumberToThousands(totalSales)}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <Pressable
              onPress={() => router.push("/drugs")}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 26, marginBottom: 6 }}>💊</Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#272757",
                }}
              >
                Drug Stock
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/addDrug")}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 26, marginBottom: 6 }}>➕</Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#272757",
                }}
              >
                Add Drug
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/creditMe")}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 26, marginBottom: 6 }}>💳</Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#272757",
                }}
              >
                Credit Me
              </Text>
            </Pressable>
          </View>

          {/* Incoming prescriptions from doctors */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#272757",
              marginBottom: 12,
            }}
          >
            Incoming Prescriptions
          </Text>
          {(prescriptions?.length ?? 0) === 0 ? (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📋</Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: "#888",
                }}
              >
                No prescriptions yet
              </Text>
            </View>
          ) : (
            prescriptions!.map((p: any) => (
              <View
                key={p._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#272757",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#272757",
                    }}
                  >
                    Patient: {p.patient?.firstName ?? "—"}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 11,
                      color: "#888",
                    }}
                  >
                    {formatDateTime(p.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    color: "#555",
                  }}
                >
                  {p.prescription}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PharmServices;
