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

const CATEGORY_COLORS: Record<string, string> = {
  student: "#1D6A3A",
  pioland: "#0E16FF",
  luxury: "#B45309",
};

const PiolandEstateDetail = () => {
  const params = useLocalSearchParams<{
    estateName: string;
    lga: string;
    ward: string;
    plots: string;
    available: string;
    valuePerPlot: string;
    features: string;
    estateId: string;
    state: string;
    category: string;
  }>();

  const cat = params.category ?? "pioland";
  const accent = CATEGORY_COLORS[cat] ?? "#0E16FF";
  const features: string[] = params.features ? JSON.parse(params.features) : [];
  const available = parseInt(params.available ?? "0");
  const totalPlots = parseInt(params.plots ?? "0");
  const valuePerPlot = parseInt(params.valuePerPlot ?? "5000000");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0", flexDirection: "column" }}>
      <StatusBar style="light" backgroundColor={accent} />

      {/* Header */}
      <View
        style={{
          backgroundColor: accent,
          paddingTop: Platform.OS === "android" ? 28 : 14,
          paddingBottom: 24,
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
            {params.estateName}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)", marginTop: 2 }}>
            {params.state} · {available} plots available
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* Features */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 13,
              color: "#272757",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            FEATURES
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#555",
              lineHeight: 22,
            }}
          >
            {features.join(", ")}
          </Text>
        </View>

        {/* Location */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 13,
              color: "#272757",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            LOCATION
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#888" }}>LGA</Text>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#272757" }}>{params.lga}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#F0F0F0", marginBottom: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#888" }}>Ward</Text>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#272757" }}>{params.ward}</Text>
          </View>
        </View>

        {/* Plot summary */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14,
            shadowColor: "#272757",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#888" }}>Property Value</Text>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: accent }}>
              ₦{(valuePerPlot / 1_000_000).toFixed(1)}M per plot
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#F0F0F0", marginBottom: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#888" }}>Plots Available</Text>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: available > 5 ? "#16A34A" : "#B91C1C" }}>
              {available} of {totalPlots}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Landscape View button — always visible at bottom */}
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
              pathname: "/piolandPlots",
              params: {
                estateId: params.estateId,
                estateName: params.estateName,
                state: params.state,
                lga: params.lga,
                ward: params.ward,
                valuePerPlot: params.valuePerPlot,
                totalPlots: params.plots,
                availablePlots: params.available,
                features: params.features,
                category: cat,
              },
            })
          }
          style={({ pressed }) => ({
            backgroundColor: accent,
            borderRadius: 14,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            opacity: pressed ? 0.88 : 1,
            shadowColor: accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          })}
        >
          <Feather name="map" size={20} color="#fffff0" />
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#fffff0" }}>
            Landscape View
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PiolandEstateDetail;
