import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");
const COLS = 3;
const PAD = 16;
const GAP = 10;
const CARD_W = (SCREEN_W - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CARD_H = 96;

type OfficeButton = {
  id: number;
  text: string;
  emoji: string;
  link?: string;
  comingSoon?: boolean;
};

const buttons: OfficeButton[] = [
  { id: 1,  text: "Hospital",      emoji: "🏥", link: "/hospitalOptions" },
  { id: 2,  text: "Emergency",     emoji: "🚨", link: "/emergencyMenu" },
  { id: 3,  text: "Real Estate",   emoji: "🏠", link: "/realEstate" },
  { id: 4,  text: "Flight",        emoji: "✈️", comingSoon: true },
  { id: 5,  text: "E-Commerce",    emoji: "🛒", comingSoon: true },
  { id: 6,  text: "Hotel",         emoji: "🏨", comingSoon: true },
  { id: 7,  text: "Insurance",     emoji: "🛡️", comingSoon: true },
  { id: 8,  text: "Entertainment", emoji: "🎬", comingSoon: true },
  { id: 9,  text: "Transport",     emoji: "🚗", comingSoon: true },
  { id: 10, text: "Chambers",      emoji: "⚖️", comingSoon: true },
  { id: 11, text: "Media House",   emoji: "📺", comingSoon: true },
  { id: 12, text: "Government",    emoji: "🏛️", comingSoon: true },
];

const Consult = () => {
  const handlePress = (button: OfficeButton) => {
    if (button.comingSoon || !button.link) {
      Alert.alert(
        "Coming Soon",
        `${button.text} will be available in a future update.`,
        [{ text: "OK" }]
      );
      return;
    }
    router.push(button.link as any);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fffff0",
        paddingTop: Platform.OS === "android" ? 10 : 0,
      }}
    >
      <StatusBar style="light" backgroundColor="#0E16FF" />

      {/* Compact header */}
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 24 : 12,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fffff0" />
        </Pressable>
        <View>
          <Text
            style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#fffff0" }}
          >
            Offices
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,240,0.7)",
              marginTop: 2,
            }}
          >
            Select a service to get started
          </Text>
        </View>
      </View>

      {/* 3-column grid — plain View to avoid VirtualizedList nesting warning */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: PAD, paddingBottom: 40 }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: GAP,
          }}
        >
          {buttons.map((button) => {
            const active = !!button.link && !button.comingSoon;
            return (
              <Pressable
                key={button.id}
                onPress={() => handlePress(button)}
                style={({ pressed }) => ({
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 6,
                  backgroundColor: active ? "#0E16FF" : "#fff",
                  borderWidth: active ? 0 : 1.5,
                  borderColor: "#E8E8E8",
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: "#272757",
                  shadowOffset: { width: 0, height: active ? 4 : 1 },
                  shadowOpacity: active ? 0.18 : 0.05,
                  shadowRadius: active ? 10 : 4,
                  elevation: active ? 5 : 1,
                })}
              >
                <Text style={{ fontSize: 28, marginBottom: 6 }}>{button.emoji}</Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 11,
                    color: active ? "#ffffff" : "#272757",
                    textAlign: "center",
                    lineHeight: 15,
                  }}
                >
                  {button.text}
                </Text>
                {button.comingSoon && (
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 8,
                      color: "#BBBBBB",
                      marginTop: 3,
                      letterSpacing: 0.4,
                    }}
                  >
                    COMING SOON
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Consult;
