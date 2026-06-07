import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");
const PLOT_SIZE = Math.floor((SCREEN_W - 40 - 48) / 7); // 7 plots per row

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

// PRD: amenity blocks that appear in the plot grid
const AMENITIES = ["School", "Supermarket", "Hospital", "Recreation", "Car Rental"];

const PiolandPlots = () => {
  const params = useLocalSearchParams<{
    estateId: string;
    estateName: string;
    state: string;
    lga: string;
    ward: string;
    valuePerPlot: string;
    totalPlots: string;
    availablePlots: string;
    features: string;
    category: string;
  }>();

  const accent = CATEGORY_COLORS[params.category ?? "pioland"] ?? "#1D6A3A";
  const totalPlots = parseInt(params.totalPlots ?? "45");
  const availablePlots = parseInt(params.availablePlots ?? "12");
  const valuePerPlot = parseInt(params.valuePerPlot ?? "5000000");
  const features: string[] = params.features ? JSON.parse(params.features) : [];

  const takenCount = totalPlots - availablePlots;
  const plots = Array.from({ length: totalPlots }, (_, i) => ({
    number: i + 1,
    available: i >= takenCount,
  }));

  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Which amenities appear in this estate
  const estateAmenities = AMENITIES.filter((a) =>
    features.some((f) => f.toLowerCase().includes(a.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0", flexDirection: "column" }}>
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
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 18, color: "#fffff0" }}>
            Landscape View
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)", marginTop: 2 }}>
            {params.estateName} · {availablePlots} plots available
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* Legend */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 14, alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#16A34A" }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#555" }}>Available</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#E5E5E5" }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#555" }}>Taken</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: accent }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#555" }}>Selected</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#F59E0B" }} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#555" }}>Amenity</Text>
          </View>
        </View>

        {/* Amenity blocks row — PRD shows School, Supermarket, Hospital etc. */}
        {estateAmenities.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {estateAmenities.map((amenity) => (
              <View
                key={amenity}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: "#FEF3C7",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#F59E0B",
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#92400E" }}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* MAIN ROAD label */}
        <View
          style={{
            backgroundColor: "#9CA3AF",
            borderRadius: 6,
            height: 22,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff", letterSpacing: 2 }}>
            MAIN ROAD
          </Text>
        </View>

        {/* Plot grid — green available, grey taken */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 12,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {plots.map((plot) => (
              <Pressable
                key={plot.number}
                disabled={!plot.available}
                onPress={() => setSelectedPlot(plot.number === selectedPlot ? null : plot.number)}
                style={({ pressed }) => ({
                  width: PLOT_SIZE,
                  height: PLOT_SIZE,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: !plot.available
                    ? "#E5E5E5"
                    : selectedPlot === plot.number
                    ? accent
                    : "#DCFCE7",
                  borderWidth: selectedPlot === plot.number ? 2 : 0,
                  borderColor: accent,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 9,
                    color: !plot.available ? "#999" : selectedPlot === plot.number ? "#fff" : "#16A34A",
                  }}
                >
                  {plot.number}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Selected plot info */}
        {selectedPlot && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#EEF0FF",
              borderRadius: 14,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: accent,
            }}
          >
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 15, color: "#272757", marginBottom: 4 }}>
              Plot {selectedPlot} selected
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#555", marginBottom: 8 }}>
              {params.estateName} · {params.lga}, {params.state}
            </Text>
            <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 22, color: accent }}>
              ₦{valuePerPlot.toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Proceed button — flex layout (not absolute) */}
      {selectedPlot && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === "android" ? 20 : 30,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(39,39,87,0.08)",
          }}
        >
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/piolandPayment",
                params: {
                  plotNumber: selectedPlot,
                  estateName: params.estateName,
                  state: params.state,
                  lga: params.lga,
                  ward: params.ward,
                  valuePerPlot: params.valuePerPlot,
                  category: params.category,
                },
              })
            }
            style={({ pressed }) => ({
              backgroundColor: accent,
              borderRadius: 14,
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: pressed ? 0.88 : 1,
              shadowColor: accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            })}
          >
            <Feather name="home" size={20} color="#fffff0" />
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#fffff0" }}>
              Proceed with Plot {selectedPlot}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PiolandPlots;
