import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const HospitalOptions = () => {
  const handlePrevious = () => {
    router.back();
  };

  const menuItems = [
    {
      emoji: "🩺",
      color: "#EEF0FF",
      title: "Talk to a doctor",
      subtitle: "Consult a specialist today",
      onPress: () => router.push("/healthIssue"),
    },
    {
      emoji: "🚑",
      color: "#FFF0F0",
      title: "Emergency Services",
      subtitle: "24/7 ambulance services",
      onPress: () => router.push("/emergencyMenu"),
    },
    {
      emoji: "👴",
      color: "#F0FFF4",
      title: "Care for the Elderly",
      subtitle: "Get a professional for your loved ones",
      onPress: () => router.push("/healthIssue"),
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fffff0" }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />

      {/* Header */}
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
        <Pressable onPress={handlePrevious} style={{ marginBottom: 16 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 24,
            color: "#fffff0",
          }}
        >
          Hospital
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          How can we be of help today?
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary service cards */}
        <View style={{ gap: 14, marginBottom: 24 }}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={item.onPress}
              className="flex-row items-center"
              style={({ pressed }) => [
                styles.card,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              {/* Circular icon container */}
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: item.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#272757",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#888",
                    marginTop: 3,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#0E16FF" />
            </Pressable>
          ))}
        </View>

        {/* Nearby services row */}
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 15,
            color: "#272757",
            marginBottom: 12,
          }}
        >
          Nearby Services
        </Text>
        <View className="flex-row" style={{ gap: 12, marginBottom: 24 }}>
          <Pressable
            onPress={() => router.push("/nearbyPharmacy")}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: pressed ? "#e8eaff" : "#EEF0FF",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: "rgba(14,22,255,0.1)",
            })}
          >
            <Text style={{ fontSize: 28 }}>💊</Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#0E16FF",
                textAlign: "center",
              }}
            >
              Nearby Pharmacy
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/nearbyMedlab")}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: pressed ? "#e4e5f5" : "#EEEEF8",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: "rgba(39,39,87,0.1)",
            })}
          >
            <Text style={{ fontSize: 28 }}>🔬</Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#272757",
                textAlign: "center",
              }}
            >
              Medical Lab
            </Text>
          </Pressable>
        </View>

        {/* Records row */}
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 15,
            color: "#272757",
            marginBottom: 12,
          }}
        >
          Your Records
        </Text>
        <View className="flex-row" style={{ gap: 12 }}>
          <Pressable
            onPress={() => router.push("/medicalHistory")}
            style={({ pressed }) => ({
              flex: 1,
              height: 48,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0E16FF",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#fffff0",
              }}
            >
              Medical History
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/recentConsultations")}
            style={({ pressed }) => ({
              flex: 1,
              height: 48,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#272757",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#fffff0",
              }}
            >
              Recent Record
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#272757",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
});

export default HospitalOptions;
