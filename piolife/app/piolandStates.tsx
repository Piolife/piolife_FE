import React from "react";
import {
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

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

      <View
        style={{
          backgroundColor: accent,
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 28,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: "#fffff0" }}>
          {CATEGORY_LABELS[cat] ?? "Properties"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#4ADE80" }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.8)" }}>
              Available
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#9CA3AF" }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.8)" }}>
              No listings yet
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={ALL_STATES}
        numColumns={3}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 48 }}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
        renderItem={({ item }) => (
          <Pressable
            disabled={!item.available}
            onPress={() =>
              router.push({
                pathname: "/piolandEstates",
                params: { state: item.name, category: cat },
              })
            }
            style={{
              flex: 1,
              marginHorizontal: 4,
              height: 52,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 4,
              backgroundColor: item.available ? accent : "#D1D5DB",
              elevation: item.available ? 3 : 0,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 11,
                color: item.available ? "#fffff0" : "#9CA3AF",
                textAlign: "center",
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
