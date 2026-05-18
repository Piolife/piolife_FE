/**
 * app/piolandPlots.tsx — NEW (replaces estateFeatures + selectPlot)
 *
 * Full estate details + visual plot grid (like the landscape map in prototype).
 * Green = available, Red = taken. Tap a plot to start the purchase flow.
 */
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

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

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

  const accent = CATEGORY_COLORS[params.category ?? "pioland"] ?? "#0E16FF";
  const totalPlots = parseInt(params.totalPlots ?? "30");
  const availablePlots = parseInt(params.availablePlots ?? "10");
  const valuePerPlot = parseInt(params.valuePerPlot ?? "5000000");
  const features: string[] = params.features ? JSON.parse(params.features) : [];

  // Build plot availability array
  // First (totalPlots - availablePlots) are taken, rest are available
  const takenCount = totalPlots - availablePlots;
  const plots = Array.from({ length: totalPlots }, (_, i) => ({
    number: i + 1,
    available: i >= takenCount,
  }));

  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  const handlePlotPress = (plotNum: number, available: boolean) => {
    if (!available) return;
    setSelectedPlot(plotNum === selectedPlot ? null : plotNum);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor={accent} />

      {/* Header */}
      <View
        style={{
          backgroundColor: accent,
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 28,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 22,
            color: "#fffff0",
          }}
        >
          {params.estateName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 4,
          }}
        >
          <Feather name="map-pin" size={12} color="rgba(255,255,240,0.7)" />
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "rgba(255,255,240,0.7)",
            }}
          >
            {params.lga}, {params.state}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Estate info */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#888",
                }}
              >
                Plot Value
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_800ExtraBold",
                  fontSize: 26,
                  color: accent,
                }}
              >
                ₦{(valuePerPlot / 1_000_000).toFixed(1)}M
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#888",
                }}
              >
                Available
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 22,
                  color: "#16A34A",
                }}
              >
                {availablePlots}/{totalPlots}
              </Text>
            </View>
          </View>

          {/* Features */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 13,
              color: "#272757",
              marginBottom: 10,
            }}
          >
            Estate Features
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {features.map((f) => (
              <View
                key={f}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: "#EEF0FF",
                  borderRadius: 20,
                }}
              >
                <Feather name="check-circle" size={12} color={accent} />
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#272757",
                  }}
                >
                  {f}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#272757",
            }}
          >
            Select a Plot
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#16A34A",
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                Available
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#E5E5E5",
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                Taken
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: accent,
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                Selected
              </Text>
            </View>
          </View>
        </View>

        {/* Plot grid — visual landscape map */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 16,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
            elevation: 5,
          }}
        >
          {/* Road label */}
          <View
            style={{
              backgroundColor: "#888",
              borderRadius: 6,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 10,
                color: "#fff",
                letterSpacing: 2,
              }}
            >
              MAIN ROAD
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {plots.map((plot) => (
              <Pressable
                key={plot.number}
                disabled={!plot.available}
                onPress={() => handlePlotPress(plot.number, plot.available)}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 8,
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
                    fontSize: 10,
                    color: !plot.available
                      ? "#999"
                      : selectedPlot === plot.number
                      ? "#fff"
                      : "#16A34A",
                  }}
                >
                  {plot.number}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Selected plot summary */}
        {selectedPlot && (
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#EEF0FF",
              borderRadius: 16,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: accent,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#272757",
                marginBottom: 4,
              }}
            >
              Plot {selectedPlot} selected
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#555",
                marginBottom: 4,
              }}
            >
              {params.estateName} · {params.lga}, {params.state}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 22,
                color: accent,
              }}
            >
              ₦{valuePerPlot.toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating CTA */}
      {selectedPlot && (
        <View style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
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
              height: 58,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: pressed ? 0.88 : 1,
              shadowColor: accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
              elevation: 8,
            })}
          >
            <Feather name="home" size={20} color="#fffff0" />
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#fffff0",
              }}
            >
              Proceed with Plot {selectedPlot}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PiolandPlots;
