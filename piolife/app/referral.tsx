// app/(tabs)/refer.tsx  — Referral screen (PRD: auto-generated referral code, wallet bonus)
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Share,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ExpoClipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import Toast from "react-native-toast-message";

const ReferScreen = () => {
  const [user, setUser] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const { data, loading } = useFetchData<any>(
    user ? `${API_URL}/api/v12/users/${user.id}/referral` : "",
    { token: user?.token }
  );

  const referralCode = data?.referralCode ?? user?.referralCode ?? "———";
  const referralCount = data?.referralCount ?? 0;
  const referralEarnings = data?.referralEarnings ?? 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join PioLife — Nigeria's #1 e-consultation app! Use my referral code ${referralCode} when signing up and we both earn 200 PioCoins. Download: https://piolife.app`,
        title: "Join PioLife",
      });
    } catch {}
  };

  const handleCopy = async () => {
    await ExpoClipboard.setStringAsync(referralCode);
    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: "Referral code copied to clipboard",
      position: "bottom",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 28 : 12,
          paddingBottom: 36,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_300Light",
            fontSize: 12,
            color: "rgba(255,255,240,0.65)",
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Earn Together
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 28,
            color: "#fffff0",
          }}
        >
          Refer & Earn
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 6,
          }}
        >
          Invite friends — you both get 200 PioCoins free
        </Text>
      </View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 24,
        }}
      >
        {/* Code card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              color: "#888",
              marginBottom: 12,
            }}
          >
            Your Referral Code
          </Text>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View
              style={{
                backgroundColor: "#EEF0FF",
                borderRadius: 14,
                paddingHorizontal: 28,
                paddingVertical: 14,
                marginBottom: 16,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#0E16FF" />
              ) : (
                <Text
                  style={{
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 28,
                    color: "#0E16FF",
                    letterSpacing: 4,
                  }}
                >
                  {referralCode}
                </Text>
              )}
            </View>
          </Animated.View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#F5F5FF",
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Feather name="copy" size={16} color="#0E16FF" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#0E16FF",
                }}
              >
                Copy
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#0E16FF",
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 10,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Feather name="share-2" size={16} color="#fffff0" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: "#fffff0",
                }}
              >
                Share
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          {[
            {
              label: "Friends Referred",
              value: referralCount,
              icon: "users",
              color: "#0E16FF",
            },
            {
              label: "PioCoins Earned",
              value: referralEarnings,
              icon: "award",
              color: "#1D6A3A",
            },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Feather
                name={s.icon as any}
                size={22}
                color={s.color}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 22,
                  color: "#272757",
                }}
              >
                {s.value}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#888",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* How it works */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#272757",
              marginBottom: 16,
            }}
          >
            How It Works
          </Text>
          {[
            { step: "1", text: "Share your unique referral code with friends" },
            { step: "2", text: "Friend signs up using your code" },
            {
              step: "3",
              text: "Both of you get 200 PioCoins added to your wallets instantly",
            },
          ].map((item) => (
            <View
              key={item.step}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "#0E16FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 13,
                    color: "#fffff0",
                  }}
                >
                  {item.step}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#555",
                  flex: 1,
                  lineHeight: 20,
                  paddingTop: 4,
                }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ReferScreen;
