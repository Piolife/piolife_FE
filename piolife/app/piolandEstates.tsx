/**
 * app/piolandEstates.tsx — REPLACES selectEstate.tsx
 *
 * Lists all estates in the chosen state.
 * Shows estate name, features preview, available plots count.
 * Routes to piolandPlots.tsx for plot selection.
 */
import React from "react";
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

// Static estate data per state — extend or move to backend as needed
const ESTATES_BY_STATE: Record<string, any[]> = {
  Abia: [
    {
      id: "ae1",
      name: "Bright View Estate",
      lga: "Umuahia North",
      ward: "Umuhu",
      plots: 45,
      available: 12,
      valuePerPlot: 5000000,
      features: [
        "Tarred Road",
        "Security",
        "School",
        "Supermarket",
        "Hospital",
        "Recreation",
        "Car Rental",
        "Street Light",
      ],
    },
    {
      id: "ae2",
      name: "Hopeland Estate",
      lga: "Umuahia South",
      ward: "Ibeku",
      plots: 30,
      available: 8,
      valuePerPlot: 4500000,
      features: ["Tarred Road", "Security", "School", "Street Light"],
    },
    {
      id: "ae3",
      name: "Pio View Estate",
      lga: "Aba North",
      ward: "Ariaria",
      plots: 60,
      available: 20,
      valuePerPlot: 6000000,
      features: [
        "Tarred Road",
        "Security",
        "Hospital",
        "Supermarket",
        "Recreation",
        "Street Light",
      ],
    },
  ],
  Lagos: [
    {
      id: "lg1",
      name: "Piolife Gardens",
      lga: "Epe",
      ward: "Eredo",
      plots: 80,
      available: 35,
      valuePerPlot: 8000000,
      features: [
        "Tarred Road",
        "Security",
        "School",
        "Hospital",
        "Supermarket",
        "Recreation",
        "Street Light",
      ],
    },
    {
      id: "lg2",
      name: "Smart View Estate",
      lga: "Ikorodu",
      ward: "Igbogbo",
      plots: 50,
      available: 15,
      valuePerPlot: 7500000,
      features: ["Tarred Road", "Security", "School", "Street Light"],
    },
  ],
  Enugu: [
    {
      id: "en1",
      name: "Coal City Heights",
      lga: "Enugu North",
      ward: "Ogbete",
      plots: 40,
      available: 10,
      valuePerPlot: 4000000,
      features: [
        "Tarred Road",
        "Security",
        "School",
        "Hospital",
        "Street Light",
      ],
    },
  ],
};

// Fallback for states without specific data
const getEstates = (state: string) =>
  ESTATES_BY_STATE[state] ?? [
    {
      id: `${state}1`,
      name: `${state} Pioland Estate`,
      lga: "Central",
      ward: "Ward A",
      plots: 30,
      available: 10,
      valuePerPlot: 5000000,
      features: ["Tarred Road", "Security", "School", "Street Light"],
    },
  ];

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

const FeatureChip = ({ label }: { label: string }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: "#EEF0FF",
      borderRadius: 20,
      marginRight: 6,
      marginBottom: 6,
    }}
  >
    <Text
      style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#0E16FF" }}
    >
      {label}
    </Text>
  </View>
);

const PiolandEstates = () => {
  const { state, category } = useLocalSearchParams<{
    state: string;
    category: string;
  }>();
  const cat = category ?? "pioland";
  const accent = CATEGORY_COLORS[cat] ?? "#0E16FF";
  const estates = getEstates(state ?? "");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor={accent} />

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
            fontFamily: "Inter_300Light",
            fontSize: 12,
            color: "rgba(255,255,240,0.65)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {state}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          Available Estates
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          {estates.length} estate{estates.length !== 1 ? "s" : ""} · tap to view
          plots
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {estates.map((estate) => (
          <Pressable
            key={estate.id}
            onPress={() =>
              router.push({
                pathname: "/piolandPlots",
                params: {
                  estateId: estate.id,
                  estateName: estate.name,
                  state: state,
                  lga: estate.lga,
                  ward: estate.ward,
                  valuePerPlot: estate.valuePerPlot,
                  totalPlots: estate.plots,
                  availablePlots: estate.available,
                  features: JSON.stringify(estate.features),
                  category: cat,
                },
              })
            }
            style={({ pressed }) => ({
              backgroundColor: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 6,
              opacity: pressed ? 0.92 : 1,
            })}
          >
            {/* Estate image placeholder */}
            <View
              style={{
                height: 120,
                backgroundColor: `${accent}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>🏘️</Text>
            </View>

            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 17,
                      color: "#272757",
                    }}
                  >
                    {estate.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 3,
                    }}
                  >
                    <Feather name="map-pin" size={12} color="#888" />
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: "#888",
                      }}
                    >
                      {estate.lga}, {state}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 15,
                      color: accent,
                    }}
                  >
                    ₦{(estate.valuePerPlot / 1_000_000).toFixed(1)}M
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 11,
                      color: "#888",
                    }}
                  >
                    per plot
                  </Text>
                </View>
              </View>

              {/* Availability bar */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: "#555",
                    }}
                  >
                    {estate.available} of {estate.plots} plots available
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                      color: estate.available > 5 ? "#16A34A" : "#B91C1C",
                    }}
                  >
                    {estate.available > 5 ? "🟢 Open" : "🔴 Almost Full"}
                  </Text>
                </View>
                <View
                  style={{
                    height: 6,
                    backgroundColor: "#F0F0F0",
                    borderRadius: 3,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor:
                        estate.available > 5 ? "#16A34A" : "#B91C1C",
                      width: `${(estate.available / estate.plots) * 100}%`,
                    }}
                  />
                </View>
              </View>

              {/* Features */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {estate.features.slice(0, 4).map((f: string) => (
                  <FeatureChip key={f} label={f} />
                ))}
                {estate.features.length > 4 && (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      backgroundColor: "#F0F0F0",
                      borderRadius: 20,
                      marginRight: 6,
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 11,
                        color: "#666",
                      }}
                    >
                      +{estate.features.length - 4} more
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: 8,
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                    color: accent,
                  }}
                >
                  View Plots
                </Text>
                <Feather name="arrow-right" size={14} color={accent} />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PiolandEstates;
