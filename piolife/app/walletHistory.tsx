import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Platform,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import { Feather } from "@expo/vector-icons";

const CREDIT_TYPES = ["fund", "loan", "credit", "refund", "bonus", "referral"];

const typeLabel = (type: string, description?: string): string => {
  if (description) return description;
  const map: Record<string, string> = {
    emergency_payment: "Emergency Service",
    consultation: "Doctor Consultation",
    fund: "Wallet Funded",
    loan: "Loan Received",
    credit: "Credit",
    refund: "Refund",
    bonus: "Bonus",
    referral: "Referral Bonus",
    deduct: "Deduction",
    payment: "Payment",
  };
  return map[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const typeIcon = (type: string): keyof typeof Feather.glyphMap => {
  const map: Record<string, keyof typeof Feather.glyphMap> = {
    emergency_payment: "alert-circle",
    consultation: "user",
    fund: "arrow-down-circle",
    loan: "credit-card",
    credit: "plus-circle",
    refund: "rotate-ccw",
    bonus: "gift",
    referral: "users",
    deduct: "minus-circle",
    payment: "shopping-bag",
  };
  return map[type] ?? "circle";
};

const isCredit = (type: string) =>
  CREDIT_TYPES.some((t) => type?.toLowerCase().includes(t));

const formatDate = (ts: string) => {
  const d = new Date(ts);
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const WalletHistory = () => {
  const [user, setUser] = useState<User>();
  const token = user?.token;

  const { data, loading } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/transactions/${user.id}` : "",
    { token }
  );

  const { data: walletData } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const transactions: any[] = data?.transactions
    ?.slice()
    ?.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) ?? [];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fffff0" }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 24 : 12,
          paddingBottom: 28,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fffff0" />
          </Pressable>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#fffff0" }}>
            Transaction History
          </Text>
        </View>

        {/* Balance summary */}
        <View
          style={{
            backgroundColor: "rgba(255,255,240,0.12)",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)" }}>
              Wallet Balance
            </Text>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: "#fffff0", marginTop: 4 }}>
              ₦{formatNumberToThousands(walletData?.balance ?? 0)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)" }}>
              Loan Balance
            </Text>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: "#fffff0", marginTop: 4 }}>
              ₦{formatNumberToThousands(walletData?.loanBalance ?? 0)}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0E16FF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 10 }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#272757", marginBottom: 4 }}>
            Recent Transactions ({transactions.length})
          </Text>

          {transactions.length === 0 ? (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
                gap: 8,
              }}
            >
              <Feather name="inbox" size={40} color="#C0C0C0" />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#888" }}>
                No transactions yet
              </Text>
            </View>
          ) : (
            transactions.map((item: any, index: number) => {
              const credit = isCredit(item.type);
              const icon = typeIcon(item.type);
              const label = typeLabel(item.type, item.description);
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    borderWidth: 1,
                    borderColor: "#F0F0F0",
                  }}
                >
                  {/* Icon */}
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: credit ? "#DCFCE7" : "#FEF2F2",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name={icon} size={20} color={credit ? "#16A34A" : "#B91C1C"} />
                  </View>

                  {/* Label + date */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#272757",
                      }}
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: "#888",
                        marginTop: 3,
                      }}
                    >
                      {formatDate(item.timestamp)}
                    </Text>
                  </View>

                  {/* Amount */}
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 15,
                      color: credit ? "#16A34A" : "#B91C1C",
                    }}
                  >
                    {credit ? "+" : "-"}₦{formatNumberToThousands(item.amount)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default WalletHistory;
