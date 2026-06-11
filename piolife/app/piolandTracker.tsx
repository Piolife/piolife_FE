/**
 * app/piolandTracker.tsx — NEW SCREEN
 *
 * Full instalment payment tracker per prototype:
 * - Shows: instalment amount, payment date, next due date, balance
 * - Total default charges, default counter, straight default counter
 * - PAY button deducts from wallet on due date
 * - If 6 consecutive defaults → deal revoked (frozen UI)
 * - If balance reaches 0 → C of O offered
 * - If outright payment → shows completed state
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const DEFAULT_CHARGE = 5000;
const MAX_STRAIGHT_DEFAULTS = 6;

// Add one month to a date
const addMonth = (dateStr: string) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const StatRow = ({
  label,
  value,
  valueColor = "#272757",
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    }}
  >
    <Text
      style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#666" }}
    >
      {label}
    </Text>
    <Text
      style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: valueColor }}
    >
      {value}
    </Text>
  </View>
);

const PiolandTracker = () => {
  const params = useLocalSearchParams<{
    plotNumber: string;
    estateName: string;
    estateId?: string;
    state: string;
    propertyValue: string;
    instalmentAmount: string;
    isOutright: string;
    officialName: string;
  }>();

  const [user, setUser] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Tracker state — in production this would come from backend/AsyncStorage
  const TRACKER_KEY = `pioland_tracker_${
    params.estateId ?? params.estateName
  }_plot${params.plotNumber}`;

  const [tracker, setTracker] = useState<{
    balance: number;
    timesPaid: number;
    lastPaymentDate: string | null;
    nextDueDate: string | null;
    totalDefaultCharges: number;
    defaultCounter: number;
    straightDefaultCounter: number;
    revoked: boolean;
    completed: boolean;
    propertyValue: number;
    instalmentAmount: number;
  } | null>(null);

  const propertyValue = parseInt(params.propertyValue ?? "5000000");
  const instalmentAmount = parseInt(params.instalmentAmount ?? "30000");
  const isOutright = params.isOutright === "true";

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
    loadTracker();
  }, []);

  const loadTracker = async () => {
    const stored = await AsyncStorage.getItem(TRACKER_KEY);
    if (stored) {
      setTracker(JSON.parse(stored));
    } else {
      // First time — initialise tracker after first payment already made
      const now = new Date().toISOString();
      const initial = {
        balance: isOutright ? 0 : propertyValue - instalmentAmount,
        timesPaid: 1,
        lastPaymentDate: now,
        nextDueDate: addMonth(now),
        totalDefaultCharges: 0,
        defaultCounter: 0,
        straightDefaultCounter: 0,
        revoked: false,
        completed: isOutright,
        // Persist so dashboard can reconstruct progress without URL params
        propertyValue,
        instalmentAmount,
      };
      await AsyncStorage.setItem(TRACKER_KEY, JSON.stringify(initial));
      setTracker(initial);
    }
  };

  const saveTracker = async (t: typeof tracker) => {
    await AsyncStorage.setItem(TRACKER_KEY, JSON.stringify(t));
    setTracker(t);
  };

  const token = user?.token;
  const { data: wallet, refetch: refetchWallet } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );
  const { postData: deductWallet } = usePostData(
    `${API_URL}/api/v12/wallet/${user?.id}/deduct`
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTracker();
    refetchWallet();
    setRefreshing(false);
  }, []);

  const handlePay = async () => {
    if (!tracker || tracker.revoked || tracker.completed) return;

    // If overdue (next due date has passed) add the ₦5,000 default charge on top
    const isOverdue =
      tracker.nextDueDate !== null &&
      new Date(tracker.nextDueDate) < new Date();
    const amountDue = instalmentAmount + (isOverdue ? DEFAULT_CHARGE : 0);

    if (!wallet || wallet.balance < amountDue) {
      Alert.alert(
        "Insufficient Balance",
        `You need ₦${formatNumberToThousands(
          amountDue
        )} for this instalment${isOverdue ? " (includes ₦5,000 overdue charge)" : ""}.\nWallet: ₦${formatNumberToThousands(
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
      "Make Instalment Payment",
      `Pay ₦${formatNumberToThousands(amountDue)} for Plot ${params.plotNumber}?${
        isOverdue ? "\n\nIncludes ₦5,000 overdue default charge." : ""
      }`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: async () => {
            setPaying(true);
            try {
              await deductWallet({
                amount: amountDue,
                description: `Pioland instalment${isOverdue ? " + default charge" : ""}: Plot ${params.plotNumber}, ${params.estateName}`,
              });

              const now = new Date().toISOString();
              // Balance only reduced by the instalmentAmount portion (default charge is a penalty, not principal)
              const newBalance = tracker.balance - instalmentAmount;

              const updated = {
                ...tracker,
                balance: Math.max(0, newBalance),
                timesPaid: tracker.timesPaid + 1,
                lastPaymentDate: now,
                nextDueDate: addMonth(now),
                straightDefaultCounter: 0, // Reset on successful payment
                // If overdue, record the default charge but mark as cleared
                totalDefaultCharges: isOverdue
                  ? tracker.totalDefaultCharges + DEFAULT_CHARGE
                  : tracker.totalDefaultCharges,
                defaultCounter: isOverdue
                  ? tracker.defaultCounter + 1
                  : tracker.defaultCounter,
                completed: newBalance <= 0,
              };

              await saveTracker(updated);
              refetchWallet();

              if (updated.completed) {
                Toast.show({
                  type: "success",
                  text1: "🎉 Payment Complete!",
                  text2: "C of O will be issued. Congratulations!",
                  position: "bottom",
                });
              } else {
                Toast.show({
                  type: "success",
                  text1: "Payment made!",
                  text2: `Next due: ${formatDate(updated.nextDueDate!)}`,
                  position: "bottom",
                });
              }
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

  if (!tracker) {
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

  const progressPct = Math.min(
    100,
    ((propertyValue - tracker.balance) / propertyValue) * 100
  );
  const isAt80Pct = progressPct >= 80;
  const accent = "#0E16FF";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar
        style="light"
        backgroundColor={
          tracker.revoked ? "#B91C1C" : tracker.completed ? "#16A34A" : accent
        }
      />
      <Toast />

      {/* Header */}
      <View
        style={{
          backgroundColor: tracker.revoked
            ? "#B91C1C"
            : tracker.completed
            ? "#16A34A"
            : accent,
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 36,
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
            fontFamily: "Inter_300Light",
            fontSize: 11,
            color: "rgba(255,255,240,0.65)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {params.estateName} · Plot {params.plotNumber}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          {tracker.completed
            ? "🎉 Fully Paid!"
            : tracker.revoked
            ? "⛔ Deal Revoked"
            : "Payment Tracker"}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: "rgba(255,255,240,0.65)",
            marginTop: 4,
          }}
        >
          {params.state} · Wallet: ₦
          {formatNumberToThousands(wallet?.balance ?? 0)}
        </Text>

        {/* Progress bar */}
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                color: "rgba(255,255,240,0.8)",
              }}
            >
              {progressPct.toFixed(1)}% paid
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                color: "rgba(255,255,240,0.8)",
              }}
            >
              ₦{formatNumberToThousands(propertyValue - tracker.balance)} / ₦
              {formatNumberToThousands(propertyValue)}
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 4,
            }}
          >
            <View
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#fffff0",
                width: `${progressPct}%`,
              }}
            />
          </View>
          {isAt80Pct && !tracker.completed && (
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 11,
                color: "#fffff0",
                marginTop: 6,
              }}
            >
              🏗️ You can begin construction!
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={accent}
          />
        }
      >
        {/* Revoked state */}
        {tracker.revoked && (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#B91C1C",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 15,
                color: "#B91C1C",
                marginBottom: 6,
              }}
            >
              Deal Revoked
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#7F1D1D",
                lineHeight: 20,
              }}
            >
              You have defaulted 6 consecutive times. This deal has been
              revoked. Piolife will deduct all default charges from your paid
              amount and refund the balance. Contact support.
            </Text>
          </View>
        )}

        {/* Completed state */}
        {tracker.completed && !isOutright && (
          <View
            style={{
              backgroundColor: "#ECFDF5",
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#16A34A",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 15,
                color: "#16A34A",
                marginBottom: 6,
              }}
            >
              🏡 Property Fully Paid!
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#166534",
                lineHeight: 20,
              }}
            >
              Congratulations {params.officialName}! Your Certificate of
              Occupancy (C of O) is being processed. You will receive it via
              email and in-app notification.
            </Text>
          </View>
        )}

        {isOutright && (
          <View
            style={{
              backgroundColor: "#ECFDF5",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 8 }}>🏡</Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 20,
                color: "#16A34A",
                textAlign: "center",
              }}
            >
              Property Purchased!
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#166534",
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Full payment received. Your Certificate of Occupancy is being
              processed, {params.officialName}.
            </Text>
          </View>
        )}

        {/* Tracker stats card */}
        {!isOutright && (
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
                fontSize: 15,
                color: "#272757",
                marginBottom: 4,
              }}
            >
              {params.estateName} · Plot {params.plotNumber}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#888",
                marginBottom: 16,
              }}
            >
              Sealed between Piolife Limited and {params.officialName}
            </Text>

            <StatRow
              label="Property Value"
              value={`₦${formatNumberToThousands(propertyValue)}`}
            />
            <StatRow
              label="Instalment Amount"
              value={`₦${formatNumberToThousands(instalmentAmount)}`}
              valueColor={accent}
            />
            <StatRow
              label="Balance Remaining"
              value={`₦${formatNumberToThousands(tracker.balance)}`}
              valueColor={tracker.balance > 0 ? "#272757" : "#16A34A"}
            />
            <StatRow label="Times Paid" value={tracker.timesPaid} />
            <StatRow
              label="Last Payment"
              value={
                tracker.lastPaymentDate
                  ? formatDate(tracker.lastPaymentDate)
                  : "—"
              }
            />
            <StatRow
              label="Next Due Date"
              value={
                tracker.nextDueDate ? formatDate(tracker.nextDueDate) : "—"
              }
              valueColor={
                tracker.nextDueDate &&
                new Date(tracker.nextDueDate) < new Date()
                  ? "#B91C1C"
                  : "#272757"
              }
            />
            <StatRow
              label="Total Default Charges"
              value={`₦${formatNumberToThousands(tracker.totalDefaultCharges)}`}
              valueColor={
                tracker.totalDefaultCharges > 0 ? "#B91C1C" : "#16A34A"
              }
            />
            <StatRow
              label="Default Counter"
              value={tracker.defaultCounter}
              valueColor={tracker.defaultCounter > 0 ? "#B45309" : "#272757"}
            />
            <StatRow
              label="Straight Default Counter"
              value={`${tracker.straightDefaultCounter} / ${MAX_STRAIGHT_DEFAULTS}`}
              valueColor={
                tracker.straightDefaultCounter >= 4
                  ? "#B91C1C"
                  : tracker.straightDefaultCounter > 0
                  ? "#B45309"
                  : "#16A34A"
              }
            />
          </View>
        )}

        {/* Warning if straight defaults >= 4 */}
        {!isOutright &&
          tracker.straightDefaultCounter >= 4 &&
          !tracker.revoked && (
            <View
              style={{
                backgroundColor: "#FEF3C7",
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: "#B45309",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#B45309",
                }}
              >
                ⚠️ Warning:{" "}
                {MAX_STRAIGHT_DEFAULTS - tracker.straightDefaultCounter} more
                defaults will revoke your deal!
              </Text>
            </View>
          )}

        {/* 80% milestone */}
        {!isOutright && isAt80Pct && !tracker.completed && (
          <View
            style={{
              backgroundColor: "#EEF0FF",
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: accent,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: accent,
                marginBottom: 4,
              }}
            >
              🏗️ Construction Eligible
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#272757",
                lineHeight: 18,
              }}
            >
              You've completed 80% of your payment. You may begin construction.
              If you start building, Piolife will waive 5 consecutive payment
              months — payments resume from month 60.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Pay button */}
      {!tracker.completed && !tracker.revoked && !isOutright && (
        <View style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <Pressable
            onPress={handlePay}
            disabled={paying}
            style={({ pressed }) => ({
              backgroundColor: paying ? "#7B83FF" : accent,
              borderRadius: 14,
              height: 58,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: pressed ? 0.88 : 1,
              shadowColor: accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
              elevation: 8,
            })}
          >
            {paying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="credit-card" size={20} color="#fffff0" />
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                    color: "#fffff0",
                  }}
                >
                  Pay ₦{formatNumberToThousands(instalmentAmount)}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PiolandTracker;
