import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";

// ─── Types ──────────────────────────────────────────────────────────────────

type NotifCategory = "all" | "wallet" | "health" | "pioland";

interface Notif {
  id: string;
  type: "wallet" | "health" | "pioland";
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  action?: () => void;
}

type ListItem =
  | { kind: "header"; label: string }
  | { kind: "notif"; notif: Notif };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function dayLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "This Week";
  if (diff < 30) return "This Month";
  return "Earlier";
}

const CREDIT_TYPES = new Set(["fund", "loan", "credit", "refund", "bonus", "referral"]);

function walletNotif(tx: any): Notif {
  const isCredit = CREDIT_TYPES.has(tx.type) || (tx.amount ?? 0) > 0 && tx.type !== "deduct" && tx.type !== "payment";
  const map: Record<string, { title: string; icon: keyof typeof Feather.glyphMap; bg: string; color: string }> = {
    fund:              { title: "Wallet Funded",    icon: "arrow-down-circle", bg: "#DCFCE7", color: "#16A34A" },
    credit:            { title: "Credit Received",  icon: "plus-circle",       bg: "#DCFCE7", color: "#16A34A" },
    bonus:             { title: "Bonus Added",       icon: "gift",              bg: "#D1FAE5", color: "#059669" },
    referral:          { title: "Referral Bonus",    icon: "users",             bg: "#D1FAE5", color: "#059669" },
    loan:              { title: "Loan Disbursed",    icon: "credit-card",       bg: "#EDE9FE", color: "#7C3AED" },
    refund:            { title: "Refund Issued",     icon: "rotate-ccw",        bg: "#DBEAFE", color: "#2563EB" },
    deduct:            { title: "Payment Deducted",  icon: "minus-circle",      bg: "#FEE2E2", color: "#DC2626" },
    payment:           { title: "Payment Made",      icon: "shopping-bag",      bg: "#FEE2E2", color: "#DC2626" },
    consultation:      { title: "Consultation Fee",  icon: "user",              bg: "#EEF0FF", color: "#0E16FF" },
    emergency_payment: { title: "Emergency Service", icon: "alert-circle",      bg: "#FFF7ED", color: "#EA580C" },
  };
  const cfg = map[tx.type] ?? {
    title: tx.type?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? "Transaction",
    icon: "activity" as keyof typeof Feather.glyphMap,
    bg: "#F3F4F6", color: "#6B7280",
  };
  const amount = Math.abs(tx.amount ?? 0);
  return {
    id: tx._id ?? String(tx.createdAt),
    type: "wallet",
    icon: cfg.icon,
    iconBg: cfg.bg,
    iconColor: cfg.color,
    title: cfg.title,
    body: tx.description
      ? tx.description
      : `PC ${formatNumberToThousands(amount)} ${isCredit ? "credited to" : "deducted from"} your wallet`,
    time: new Date(tx.createdAt ?? Date.now()),
    read: false,
    action: () => router.push("/walletHistory"),
  };
}

function consultationNotif(c: any): Notif {
  const statusMap: Record<string, { title: string; body: string; icon: keyof typeof Feather.glyphMap; bg: string; color: string }> = {
    pending:   { title: "Consultation Pending",   body: "Your consultation request is awaiting a doctor.", icon: "clock",      bg: "#FEF3C7", color: "#D97706" },
    active:    { title: "Consultation Active",    body: "You are currently in a consultation.",            icon: "video",      bg: "#DBEAFE", color: "#2563EB" },
    completed: { title: "Consultation Complete",  body: "Your consultation has ended. Check your report.", icon: "check-circle", bg: "#DCFCE7", color: "#16A34A" },
    cancelled: { title: "Consultation Cancelled", body: "Your consultation was cancelled.",                icon: "x-circle",   bg: "#FEE2E2", color: "#DC2626" },
  };
  const cfg = statusMap[c.status] ?? statusMap.pending;
  return {
    id: c._id ?? String(c.createdAt),
    type: "health",
    icon: cfg.icon,
    iconBg: cfg.bg,
    iconColor: cfg.color,
    title: cfg.title,
    body: c.issues?.length ? `For: ${c.issues.slice(0, 2).join(", ")}${c.issues.length > 2 ? " +" + (c.issues.length - 2) + " more" : ""}` : cfg.body,
    time: new Date(c.createdAt ?? Date.now()),
    read: false,
    action: () => router.push("/recentConsultations"),
  };
}

function prescriptionNotif(p: any): Notif {
  return {
    id: `rx-${p._id ?? String(p.createdAt)}`,
    type: "health",
    icon: "file-text",
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
    title: "Prescription Ready",
    body: p.prescription ? `${p.prescription.slice(0, 60)}${p.prescription.length > 60 ? "…" : ""}` : "Your doctor has completed your consultation report.",
    time: new Date(p.createdAt ?? Date.now()),
    read: false,
    action: () => router.push("/medicalHistory"),
  };
}

function groupIntoSections(notifs: Notif[]): ListItem[] {
  if (!notifs.length) return [];
  const sorted = [...notifs].sort((a, b) => b.time.getTime() - a.time.getTime());
  const result: ListItem[] = [];
  let lastLabel = "";
  for (const n of sorted) {
    const label = dayLabel(n.time);
    if (label !== lastLabel) {
      result.push({ kind: "header", label });
      lastLabel = label;
    }
    result.push({ kind: "notif", notif: n });
  }
  return result;
}

// ─── Category tab ────────────────────────────────────────────────────────────

const TABS: { id: NotifCategory; label: string }[] = [
  { id: "all",    label: "All" },
  { id: "wallet", label: "Wallet" },
  { id: "health", label: "Health" },
  { id: "pioland", label: "Pioland" },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

const NotificationScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<NotifCategory>("all");

  const token = user?.token;

  const loadReadIds = async () => {
    try {
      const raw = await AsyncStorage.getItem("notif_read_ids");
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {}
  };

  const markRead = async (id: string) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    await AsyncStorage.setItem("notif_read_ids", JSON.stringify([...next]));
  };

  const markAllRead = async () => {
    const allIds = notifs.map((n) => n.id);
    const next = new Set([...readIds, ...allIds]);
    setReadIds(next);
    await AsyncStorage.setItem("notif_read_ids", JSON.stringify([...next]));
  };

  const fetchAll = useCallback(async (u: any) => {
    if (!u) return;
    const headers = { Authorization: `Bearer ${u.token}`, "Content-Type": "application/json" };
    const collected: Notif[] = [];

    try {
      const [txRes, consultRes, rxRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/v12/wallet/${u.id}/history`, { headers }),
        fetch(`${API_URL}/api/v12/sessions/consultations/user/${u.id}`, { headers }),
        fetch(`${API_URL}/api/v12/sessions/prescriptions/user/${u.id}`, { headers }),
      ]);

      if (txRes.status === "fulfilled" && txRes.value.ok) {
        const txData = await txRes.value.json();
        (Array.isArray(txData) ? txData : txData.transactions ?? [])
          .slice(0, 20)
          .forEach((tx: any) => collected.push(walletNotif(tx)));
      }

      if (consultRes.status === "fulfilled" && consultRes.value.ok) {
        const cData = await consultRes.value.json();
        (Array.isArray(cData) ? cData : [])
          .slice(0, 10)
          .forEach((c: any) => collected.push(consultationNotif(c)));
      }

      if (rxRes.status === "fulfilled" && rxRes.value.ok) {
        const rxData = await rxRes.value.json();
        (Array.isArray(rxData) ? rxData : [])
          .slice(0, 10)
          .forEach((p: any) => collected.push(prescriptionNotif(p)));
      }
    } catch {}

    setNotifs(collected);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("user").then(async (raw) => {
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
        await loadReadIds();
        await fetchAll(u);
      }
      setLoading(false);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll(user);
    setRefreshing(false);
  };

  const filtered = notifs.filter((n) => tab === "all" || n.type === tab);
  const listItems = groupIntoSections(filtered);
  const unreadCount = notifs.filter((n) => !readIds.has(n.id)).length;

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "header") {
      return (
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 11,
            color: "#9CA3AF",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 8,
          }}
        >
          {item.label}
        </Text>
      );
    }

    const { notif } = item;
    const isRead = readIds.has(notif.id);

    return (
      <Pressable
        onPress={() => {
          markRead(notif.id);
          notif.action?.();
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
          paddingHorizontal: 20,
          paddingVertical: 14,
          backgroundColor: isRead ? "#fffff0" : "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
          opacity: pressed ? 0.88 : 1,
        })}
      >
        {/* Icon */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: notif.iconBg,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Feather name={notif.icon} size={20} color={notif.iconColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text
              style={{
                fontFamily: isRead ? "Inter_500Medium" : "Inter_700Bold",
                fontSize: 14,
                color: "#272757",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {notif.title}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 11,
                color: "#9CA3AF",
                flexShrink: 0,
              }}
            >
              {formatRelativeTime(notif.time)}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {notif.body}
          </Text>
        </View>

        {/* Unread dot */}
        {!isRead && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#0E16FF",
              marginTop: 4,
              flexShrink: 0,
            }}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#272757" }}>
      <StatusBar style="light" backgroundColor="#272757" />

      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === "android" ? 16 : 8,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <Feather name="arrow-left" size={24} color="#fffff0" />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="bell" size={22} color="#fffff0" />
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#fffff0" }}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View
                style={{
                  backgroundColor: "#0E16FF",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 11, color: "#fff" }}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </View>

          {unreadCount > 0 ? (
            <Pressable onPress={markAllRead} style={{ padding: 4 }}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: "rgba(255,255,240,0.7)" }}>
                Mark all read
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: 80 }} />
          )}
        </View>

        {/* Category tabs */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginTop: 18,
          }}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = t.id === "all"
              ? notifs.filter((n) => !readIds.has(n.id)).length
              : notifs.filter((n) => n.type === t.id && !readIds.has(n.id)).length;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: active ? "#0E16FF" : "rgba(255,255,255,0.12)",
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? "Inter_700Bold" : "Inter_400Regular",
                    fontSize: 12,
                    color: active ? "#fffff0" : "rgba(255,255,240,0.65)",
                  }}
                >
                  {t.label}
                  {count > 0 ? ` (${count})` : ""}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* List */}
      <View style={{ flex: 1, backgroundColor: "#fffff0", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#0E16FF" />
          </View>
        ) : (
          <FlatList
            data={listItems}
            keyExtractor={(item, i) =>
              item.kind === "header" ? `h-${item.label}` : item.notif.id
            }
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0E16FF"
              />
            }
            contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: "#EEF0FF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <Feather name="bell-off" size={30} color="#9CA3AF" />
                </View>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#272757" }}>
                  No notifications yet
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#9CA3AF", textAlign: "center", paddingHorizontal: 40 }}>
                  Activity from your wallet, consultations, and prescriptions will appear here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
