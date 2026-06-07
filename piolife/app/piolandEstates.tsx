import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

const ESTATES_BY_STATE: Record<string, any[]> = {
  Abia: [
    { id: "ae1", name: "Bright View Estate", lga: "Umuahia North", ward: "Umuhu", plots: 45, available: 12, valuePerPlot: 5000000, features: ["Tarred Road", "Security", "School", "Supermarket", "Hospital", "Recreation", "Car Rental", "Street Light"] },
    { id: "ae2", name: "Hopeland Estate", lga: "Umuahia South", ward: "Ibeku", plots: 30, available: 8, valuePerPlot: 4500000, features: ["Tarred Road", "Security", "School", "Street Light"] },
    { id: "ae3", name: "Pio Lander Estate", lga: "Aba North", ward: "Ariaria", plots: 60, available: 20, valuePerPlot: 6000000, features: ["Tarred Road", "Security", "Hospital", "Supermarket", "Recreation", "Street Light"] },
    { id: "ae4", name: "Pio View Estate", lga: "Aba South", ward: "Ogbor Hill", plots: 40, available: 15, valuePerPlot: 5500000, features: ["Tarred Road", "Security", "School", "Street Light"] },
    { id: "ae5", name: "Ecosinger Estate", lga: "Isuikwuato", ward: "Isuikwuato", plots: 35, available: 10, valuePerPlot: 4000000, features: ["Tarred Road", "Security", "School"] },
    { id: "ae6", name: "Smart View Estate", lga: "Ugwunagbo", ward: "Ugwunagbo", plots: 25, available: 5, valuePerPlot: 3500000, features: ["Tarred Road", "Security"] },
    { id: "ae7", name: "Biat View Estate", lga: "Ukwa East", ward: "Ukwa East", plots: 20, available: 7, valuePerPlot: 3000000, features: ["Tarred Road", "Security", "Street Light"] },
  ],
  Lagos: [
    { id: "lg1", name: "Piolife Gardens", lga: "Epe", ward: "Eredo", plots: 80, available: 35, valuePerPlot: 8000000, features: ["Tarred Road", "Security", "School", "Hospital", "Supermarket", "Recreation", "Street Light"] },
    { id: "lg2", name: "Smart View Estate", lga: "Ikorodu", ward: "Igbogbo", plots: 50, available: 15, valuePerPlot: 7500000, features: ["Tarred Road", "Security", "School", "Street Light"] },
  ],
  Enugu: [
    { id: "en1", name: "Coal City Heights", lga: "Enugu North", ward: "Ogbete", plots: 40, available: 10, valuePerPlot: 4000000, features: ["Tarred Road", "Security", "School", "Hospital", "Street Light"] },
  ],
};

const getEstates = (state: string) =>
  ESTATES_BY_STATE[state] ?? [
    { id: `${state}1`, name: `${state} Pioland Estate`, lga: "Central", ward: "Ward A", plots: 30, available: 10, valuePerPlot: 5000000, features: ["Tarred Road", "Security", "School", "Street Light"] },
  ];

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

const PiolandEstates = () => {
  const { state, category } = useLocalSearchParams<{ state: string; category: string }>();
  const cat = category ?? "pioland";
  const accent = CATEGORY_COLORS[cat] ?? "#0E16FF";
  const estates = getEstates(state ?? "");
  const [selected, setSelected] = useState<any>(estates[0]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor={accent} />

      {/* Header */}
      <View
        style={{
          backgroundColor: accent,
          paddingTop: Platform.OS === "android" ? 26 : 14,
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
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 18, color: "#fffff0" }}>
            {state}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)", marginTop: 2 }}>
            {estates.length} estate{estates.length !== 1 ? "s" : ""} available
          </Text>
        </View>
      </View>

      {/* PRD: left list + right detail panel */}
      <View style={{ flex: 1, flexDirection: "row" }}>

        {/* Left — estate name list */}
        <ScrollView
          style={{ width: "38%", borderRightWidth: 1, borderRightColor: "#E8E8E8" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {estates.map((estate) => {
            const isSelected = selected?.id === estate.id;
            return (
              <Pressable
                key={estate.id}
                onPress={() => setSelected(estate)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  backgroundColor: isSelected ? accent : "transparent",
                  borderLeftWidth: isSelected ? 4 : 0,
                  borderLeftColor: "#fffff0",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: isSelected ? "Inter_700Bold" : "Inter_500Medium",
                    fontSize: 12,
                    color: isSelected ? "#fffff0" : "#272757",
                    lineHeight: 17,
                  }}
                >
                  {estate.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: estate.available > 5 ? "#16A34A" : "#B91C1C" }} />
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: isSelected ? "rgba(255,255,240,0.7)" : "#888" }}>
                    {estate.available} plots
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Right — selected estate detail */}
        {selected && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Estate name heading */}
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#272757", marginBottom: 12 }}>
              {selected.name}
            </Text>

            {/* Features box */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                marginBottom: 14,
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 12, color: "#272757", marginBottom: 8, letterSpacing: 0.5 }}>
                FEATURES
              </Text>
              <Text
                style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#555", lineHeight: 20 }}
              >
                {selected.features.join(", ")}
              </Text>
            </View>

            {/* Location box */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 12, color: "#272757", marginBottom: 8, letterSpacing: 0.5 }}>
                LOCATION
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Feather name="map-pin" size={12} color={accent} />
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: "#555" }}>
                  LGA: <Text style={{ color: "#272757" }}>{selected.lga}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name="map" size={12} color={accent} />
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: "#555" }}>
                  Ward: <Text style={{ color: "#272757" }}>{selected.ward}</Text>
                </Text>
              </View>
            </View>

            {/* Plot value */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: "#888" }}>Plot Value</Text>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: accent }}>
                ₦{(selected.valuePerPlot / 1_000_000).toFixed(1)}M
              </Text>
            </View>

            {/* Landscape View button */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/piolandPlots",
                  params: {
                    estateId: selected.id,
                    estateName: selected.name,
                    state,
                    lga: selected.lga,
                    ward: selected.ward,
                    valuePerPlot: selected.valuePerPlot,
                    totalPlots: selected.plots,
                    availablePlots: selected.available,
                    features: JSON.stringify(selected.features),
                    category: cat,
                  },
                })
              }
              style={({ pressed }) => ({
                backgroundColor: accent,
                borderRadius: 12,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                opacity: pressed ? 0.88 : 1,
                shadowColor: accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              })}
            >
              <Feather name="map" size={16} color="#fffff0" />
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: "#fffff0" }}>
                Landscape View
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PiolandEstates;
