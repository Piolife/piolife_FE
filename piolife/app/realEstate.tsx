/**
 * app/realEstate.tsx — REBUILT
 * Pioland entry screen with 3 offer categories per prototype.
 * Student/NYSC, Pioland Properties, Luxury Apartments.
 * Each routes to states.tsx passing the category as a param.
 */
import React from "react";
import {
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

const OFFERS: {
  id: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  requiresId: boolean;
}[] = [
  {
    id: "student",
    icon: "award",
    title: "Student / NYSC Corps",
    subtitle: "Exclusive student & corps member packages",
    accent: "#1D6A3A",
    bg: "#E6F4EC",
    requiresId: true,
  },
  {
    id: "pioland",
    icon: "grid",
    title: "Pioland Properties",
    subtitle: "Residential plots with all amenities included",
    accent: "#0E16FF",
    bg: "#EEF0FF",
    requiresId: false,
  },
  {
    id: "luxury",
    icon: "star",
    title: "Luxury Apartments",
    subtitle: "Premium apartments — outright payment only",
    accent: "#B45309",
    bg: "#FEF3C7",
    requiresId: false,
  },
];

const RealEstate = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
    <StatusBar style="light" backgroundColor="#0E16FF" />

    {/* Header */}
    <View
      style={{
        backgroundColor: "#0E16FF",
        paddingTop: Platform.OS === "android" ? 30 : 16,
        paddingBottom: 48,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
      }}
    >
      {/* Decorative circles */}
      <View
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: "rgba(255,255,240,0.05)",
        }}
      />

      <Pressable onPress={() => router.back()} style={{ marginBottom: 28 }}>
        <Feather name="arrow-left" size={24} color="#fffff0" />
      </Pressable>

      <Text
        style={{
          fontFamily: "Inter_300Light",
          fontSize: 12,
          color: "rgba(255,255,240,0.65)",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Piolife Real Estate
      </Text>
      <Text
        style={{
          fontFamily: "Inter_800ExtraBold",
          fontSize: 32,
          color: "#fffff0",
          lineHeight: 38,
        }}
      >
        Pioland
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 14,
          color: "rgba(255,255,240,0.75)",
          marginTop: 8,
          lineHeight: 20,
        }}
      >
        Find the perfect space for your dream home.{"\n"}Pay in instalments
        directly from your wallet.
      </Text>
    </View>

    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 60, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* My Properties CTA */}
      <Pressable
        onPress={() => router.push("/piolandDashboard")}
        className="flex-row items-center"
        style={({ pressed }) => ({
          backgroundColor: "#272757",
          borderRadius: 20,
          padding: 18,
          gap: 14,
          opacity: pressed ? 0.9 : 1,
          shadowColor: "#272757",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 18,
          elevation: 8,
        })}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="home" size={24} color="#fffff0" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "#fffff0",
            }}
          >
            My Properties
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,240,0.7)",
              marginTop: 2,
            }}
          >
            Track payments & progress
          </Text>
        </View>
        <Feather name="arrow-right" size={20} color="#fffff0" />
      </Pressable>

      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 15,
          color: "#272757",
          marginBottom: 4,
          marginTop: 4,
        }}
      >
        Choose a Package
      </Text>

      {OFFERS.map((offer) => (
        <Pressable
          key={offer.id}
          onPress={() =>
            router.push({
              pathname: "/piolandStates",
              params: { category: offer.id },
            })
          }
          className="flex-row items-center"
          style={({ pressed }) => ({
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            gap: 16,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            opacity: pressed ? 0.92 : 1,
            borderWidth: 1.5,
            borderColor: `${offer.accent}15`,
          })}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              backgroundColor: offer.bg,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Feather name={offer.icon} size={26} color={offer.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#272757",
                marginBottom: 4,
              }}
            >
              {offer.title}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#888",
                lineHeight: 18,
              }}
            >
              {offer.subtitle}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={offer.accent} />
        </Pressable>
      ))}

      {/* Info card */}
      <View
        className="flex-row items-start"
        style={{
          backgroundColor: "#EEF0FF",
          borderRadius: 16,
          padding: 16,
          marginTop: 8,
          gap: 12,
        }}
      >
        <Feather name="info" size={20} color="#0E16FF" />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 13,
              color: "#0E16FF",
              marginBottom: 4,
            }}
          >
            Payment from Wallet
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#272757",
              lineHeight: 18,
            }}
          >
            All instalment payments are deducted directly from your Piolife
            wallet. ₦1 = 1 Pio Coin.
          </Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default RealEstate;
