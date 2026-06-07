import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { User } from "@/services/core/types";

const profile = require("../../assets/images/profile.png");
const key = require("../../assets/images/key-square.png");
const call = require("../../assets/images/call-calling.png");
const login = require("../../assets/images/login.png");

type SettingsRow = {
  icon: any;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  badge?: string;
};

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const role = (user?.role ?? "").toLowerCase();
  const isClient = role === "client";

  const openSupport = () => {
    Alert.alert(
      "Customer Support",
      "How would you like to reach us?",
      [
        {
          text: "Call Us",
          onPress: () => Linking.openURL("tel:+2348000000000"),
        },
        {
          text: "WhatsApp",
          onPress: () =>
            Linking.openURL("https://wa.me/2348000000000?text=Hello%20Piolife%20Support"),
        },
        {
          text: "Email",
          onPress: () => Linking.openURL("mailto:support@piolife.com"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const rows: SettingsRow[] = [
    {
      icon: profile,
      label: "Profile",
      onPress: () => router.push("/profile"),
    },
    {
      icon: key,
      label: "Login Settings",
      onPress: () => router.push("/loginSettings"),
    },
    ...(isClient
      ? [
          {
            icon: null,
            label: "VIP / Health Insurance",
            badge: "Premium",
            onPress: () => router.push("/vipSubscription"),
          } as SettingsRow,
          {
            icon: null,
            label: "Subscribe (App Data)",
            onPress: () => router.push("/appDataSubscription"),
          } as SettingsRow,
          {
            icon: null,
            label: "My Referrals",
            onPress: () => router.push("/referral"),
          } as SettingsRow,
        ]
      : []),
    {
      icon: call,
      label: "Customer Support",
      onPress: openSupport,
    },
    {
      icon: login,
      label: "Log Out",
      danger: true,
      onPress: async () => {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("userEmail");
        router.replace("/login" as any);
      },
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fffff0",
        paddingTop: Platform.OS === "android" ? 20 : 0,
      }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: Platform.OS === "android" ? 16 : 12,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(39,39,87,0.06)",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 22,
            color: "#272757",
          }}
        >
          Settings
        </Text>
        {user && (
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#888",
              marginTop: 4,
            }}
          >
            {user.firstName
              ? `${user.firstName} · `
              : ""}
            ID: {(user as any).username}
          </Text>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, gap: 10 }}
      >
        {rows.map((row, idx) => (
          <Pressable
            key={idx}
            onPress={row.onPress}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              opacity: pressed ? 0.88 : 1,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            })}
          >
            {/* Icon box */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: row.danger ? "#FEF2F2" : "#EEF0FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {row.icon ? (
                <Image
                  source={row.icon}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
              ) : (
                <Feather
                  name={
                    row.label.includes("VIP") ? "award" :
                    row.label.includes("App Data") ? "wifi" :
                    row.label.includes("Referral") ? "users" : "settings"
                  }
                  size={20}
                  color={row.danger ? "#B91C1C" : "#0E16FF"}
                />
              )}
            </View>

            {/* Label */}
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 15,
                  color: row.danger ? "#B91C1C" : "#272757",
                  flex: 1,
                }}
              >
                {row.label}
              </Text>
              {row.badge && (
                <View
                  style={{
                    backgroundColor: "#0E16FF",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 10,
                      color: "#fffff0",
                    }}
                  >
                    {row.badge.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <Feather
              name="chevron-right"
              size={18}
              color={row.danger ? "#B91C1C" : "#AAAAAA"}
            />
          </Pressable>
        ))}

        {/* App version */}
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: "#BBBBBB",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          CONZOT+ · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
