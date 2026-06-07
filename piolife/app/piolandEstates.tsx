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

export const ESTATES_BY_STATE: Record<string, any[]> = {
  Abia: [
    { id: "ae1", name: "Bright View Estate",  lga: "Umuahia North", ward: "Umuhu",    plots: 45, available: 12, valuePerPlot: 5000000, features: ["Tarred Road","Security","School","Supermarket","Hospital","Recreation","Car Rental","Street Light"] },
    { id: "ae2", name: "Hopeland Estate",     lga: "Umuahia South", ward: "Ibeku",    plots: 30, available: 8,  valuePerPlot: 4500000, features: ["Tarred Road","Security","School","Street Light"] },
    { id: "ae3", name: "Pio Lander Estate",   lga: "Aba North",     ward: "Ariaria",  plots: 60, available: 20, valuePerPlot: 6000000, features: ["Tarred Road","Security","Hospital","Supermarket","Recreation","Street Light"] },
    { id: "ae4", name: "Pio View Estate",     lga: "Aba South",     ward: "Ogbor Hill", plots: 40, available: 15, valuePerPlot: 5500000, features: ["Tarred Road","Security","School","Street Light"] },
    { id: "ae5", name: "Ecosinger Estate",    lga: "Isuikwuato",    ward: "Isuikwuato", plots: 35, available: 10, valuePerPlot: 4000000, features: ["Tarred Road","Security","School"] },
    { id: "ae6", name: "Smart View Estate",   lga: "Ugwunagbo",     ward: "Ugwunagbo",  plots: 25, available: 5,  valuePerPlot: 3500000, features: ["Tarred Road","Security"] },
    { id: "ae7", name: "Biat View Estate",    lga: "Ukwa East",     ward: "Ukwa East",  plots: 20, available: 7,  valuePerPlot: 3000000, features: ["Tarred Road","Security","Street Light"] },
  ],
  Lagos: [
    { id: "lg1", name: "Piolife Gardens",     lga: "Epe",      ward: "Eredo",   plots: 80, available: 35, valuePerPlot: 8000000, features: ["Tarred Road","Security","School","Hospital","Supermarket","Recreation","Street Light"] },
    { id: "lg2", name: "Smart View Estate",   lga: "Ikorodu",  ward: "Igbogbo", plots: 50, available: 15, valuePerPlot: 7500000, features: ["Tarred Road","Security","School","Street Light"] },
  ],
  Enugu: [
    { id: "en1", name: "Coal City Heights",   lga: "Enugu North", ward: "Ogbete", plots: 40, available: 10, valuePerPlot: 4000000, features: ["Tarred Road","Security","School","Hospital","Street Light"] },
  ],
};

export const getEstates = (state: string) =>
  ESTATES_BY_STATE[state] ?? [
    { id: `${state}1`, name: `${state} Pioland Estate`, lga: "Central", ward: "Ward A", plots: 30, available: 10, valuePerPlot: 5000000, features: ["Tarred Road","Security","School","Street Light"] },
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
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
        <View>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#fffff0" }}>
            {state}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,240,0.7)", marginTop: 2 }}>
            Available Estates
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {estates.map((estate) => (
          <Pressable
            key={estate.id}
            onPress={() =>
              router.push({
                pathname: "/piolandEstateDetail",
                params: {
                  estateName: estate.name,
                  lga: estate.lga,
                  ward: estate.ward,
                  plots: estate.plots,
                  available: estate.available,
                  valuePerPlot: estate.valuePerPlot,
                  features: JSON.stringify(estate.features),
                  estateId: estate.id,
                  state,
                  category: cat,
                },
              })
            }
            style={({ pressed }) => ({
              backgroundColor: accent,
              borderRadius: 12,
              height: 56,
              paddingHorizontal: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: pressed ? 0.85 : 1,
              shadowColor: accent,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 4,
            })}
          >
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fffff0" }}>
              {estate.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: estate.available > 5 ? "#4ADE80" : "#FCA5A5" }} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,240,0.8)" }}>
                  {estate.available} plots
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="rgba(255,255,240,0.8)" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PiolandEstates;
