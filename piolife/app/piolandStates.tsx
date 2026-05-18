/**
 * app/piolandStates.tsx — REPLACES states.tsx + selectPlot.tsx
 *
 * All 36 Nigerian states displayed as a grid.
 * Green = properties available, Grey = none (unclickable).
 * Passes state name + category to the estate list screen.
 */
import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

// States with property availability. Toggle to false when no listings exist.
const ALL_STATES = [
  { name: "Abia", available: true },
  { name: "Abuja (FCT)", available: true },
  { name: "Adamawa", available: false },
  { name: "Akwa Ibom", available: true },
  { name: "Anambra", available: true },
  { name: "Bauchi", available: false },
  { name: "Bayelsa", available: true },
  { name: "Benue", available: false },
  { name: "Borno", available: false },
  { name: "Cross River", available: true },
  { name: "Delta", available: true },
  { name: "Ebonyi", available: false },
  { name: "Edo", available: true },
  { name: "Ekiti", available: false },
  { name: "Enugu", available: true },
  { name: "Gombe", available: false },
  { name: "Imo", available: true },
  { name: "Jigawa", available: false },
  { name: "Kaduna", available: true },
  { name: "Kano", available: false },
  { name: "Katsina", available: false },
  { name: "Kebbi", available: false },
  { name: "Kogi", available: true },
  { name: "Kwara", available: true },
  { name: "Lagos", available: true },
  { name: "Nasarawa", available: false },
  { name: "Niger", available: false },
  { name: "Ogun", available: true },
  { name: "Ondo", available: true },
  { name: "Osun", available: false },
  { name: "Oyo", available: true },
  { name: "Plateau", available: false },
  { name: "Rivers", available: true },
  { name: "Sokoto", available: false },
  { name: "Taraba", available: false },
  { name: "Yobe", available: false },
  { name: "Zamfara", available: false },
];

const CATEGORY_LABELS: Record<string, string> = {
  student: "Student / NYSC Properties",
  pioland: "Pioland Properties",
  luxury: "Luxury Apartments",
};

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

const PiolandStates = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const cat = category ?? "pioland";
  const accent = CATEGORY_COLORS[cat] ?? "#0E16FF";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor={accent} />

      {/* Header */}
      <View
        style={{
          backgroundColor: accent,
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
          {CATEGORY_LABELS[cat] ?? "Properties"}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 6,
          }}
        >
          🟢 Available · ⬜ No listings yet
        </Text>
      </View>

      <FlatList
        data={ALL_STATES}
        keyExtractor={(item) => item.name}
        numColumns={3}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
        renderItem={({ item }) => (
          <Pressable
            disabled={!item.available}
            onPress={() =>
              router.push({
                pathname: "/piolandEstates",
                params: { state: item.name, category: cat },
              })
            }
            style={({ pressed }) => ({
              flex: 1,
              height: 52,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: item.available ? accent : "#E5E5E5",
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: item.name.length > 8 ? 10 : 12,
                color: item.available ? "#fffff0" : "#999",
                textAlign: "center",
                paddingHorizontal: 4,
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default PiolandStates;
