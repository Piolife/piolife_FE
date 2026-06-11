/**
 * app/piolandDashboard.tsx — NEW SCREEN
 *
 * Client's "My Properties" dashboard.
 * Shows all plots purchased, payment progress, quick-navigate to tracker.
 * Accessed from home screen quick actions.
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatNumberToThousands } from "@/components/reusables";

const PiolandDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProperties = useCallback(async () => {
    // Load all saved tracker keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const trackerKeys = keys.filter((k) => k.startsWith("pioland_tracker_"));
    const results = await AsyncStorage.multiGet(trackerKeys);
    const parsed = results
      .filter(([, val]) => val !== null)
      .map(([key, val]) => {
        const data = JSON.parse(val!);
        // Parse info from key: pioland_tracker_{estateName}_plot{plotNumber}
        const parts = key.replace("pioland_tracker_", "").split("_plot");
        return {
          key,
          estateName: parts[0] ?? "Estate",
          plotNumber: parts[1] ?? "?",
          ...data,
        };
      });
    setProperties(parsed);
    setLoading(false);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
    loadProperties();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffff0",
        }}
      >
        <ActivityIndicator size="large" color="#0E16FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="light" backgroundColor="#0E16FF" />

      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 30 : 16,
          paddingBottom: 36,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        {/* decorative */}
        <View
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

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
          Pioland
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 28,
            color: "#fffff0",
          }}
        >
          My Properties
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          {properties.length} plot{properties.length !== 1 ? "s" : ""} in your
          portfolio
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0E16FF"
          />
        }
      >
        {/* Buy new property CTA */}
        <Pressable
          onPress={() => router.push("/realEstate")}
          style={({ pressed }) => ({
            backgroundColor: "#EEF0FF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            opacity: pressed ? 0.88 : 1,
            borderWidth: 1.5,
            borderColor: "#C7D2FE",
          })}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: "#0E16FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="plus" size={22} color="#fffff0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 14,
                color: "#0E16FF",
              }}
            >
              Browse New Properties
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#555",
                marginTop: 2,
              }}
            >
              Explore Pioland, Student & Luxury packages
            </Text>
          </View>
          <Feather name="arrow-right" size={18} color="#0E16FF" />
        </Pressable>

        {properties.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 48 }}>🏡</Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#272757",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              No properties yet
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#888",
                marginTop: 8,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Browse available plots and start your land ownership journey with
              Pioland.
            </Text>
            <Pressable
              onPress={() => router.push("/realEstate")}
              style={{
                marginTop: 20,
                backgroundColor: "#0E16FF",
                borderRadius: 14,
                paddingHorizontal: 28,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 14,
                  color: "#fffff0",
                }}
              >
                Explore Estates
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#272757",
                marginBottom: 14,
              }}
            >
              Your Plots
            </Text>
            {properties.map((prop) => {
              const progressPct = Math.min(
                100,
                prop.balance !== undefined
                  ? ((prop.propertyValue - prop.balance) / prop.propertyValue) *
                      100
                  : 100
              );

              const statusColor = prop.revoked
                ? "#B91C1C"
                : prop.completed
                ? "#16A34A"
                : "#0E16FF";
              const statusLabel = prop.revoked
                ? "Revoked"
                : prop.completed
                ? "Fully Paid"
                : "Active";

              return (
                <Pressable
                  key={prop.key}
                  onPress={() =>
                    router.push({
                      pathname: "/piolandTracker",
                      params: {
                        plotNumber: prop.plotNumber,
                        estateName: prop.estateName,
                        propertyValue: String(prop.propertyValue ?? 5000000),
                        instalmentAmount: String(
                          prop.instalmentAmount ?? 30000
                        ),
                        isOutright: prop.isOutright ? "true" : "false",
                        officialName:
                          prop.officialName ?? user?.firstName ?? "",
                      },
                    })
                  }
                  style={({ pressed }) => ({
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 18,
                    marginBottom: 14,
                    shadowColor: "#272757",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.08,
                    shadowRadius: 14,
                    elevation: 5,
                    opacity: pressed ? 0.92 : 1,
                    borderLeftWidth: 4,
                    borderLeftColor: statusColor,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 16,
                          color: "#272757",
                        }}
                      >
                        {prop.estateName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#888",
                          marginTop: 2,
                        }}
                      >
                        Plot {prop.plotNumber}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                        backgroundColor: `${statusColor}15`,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 11,
                          color: statusColor,
                        }}
                      >
                        {statusLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={{ marginBottom: 12 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 12,
                          color: "#555",
                        }}
                      >
                        {progressPct.toFixed(0)}% paid
                      </Text>
                      {prop.nextDueDate && !prop.completed && (
                        <Text
                          style={{
                            fontFamily: "Inter_500Medium",
                            fontSize: 11,
                            color: "#888",
                          }}
                        >
                          Due:{" "}
                          {new Date(prop.nextDueDate).toLocaleDateString(
                            "en-NG",
                            { day: "numeric", month: "short" }
                          )}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        height: 7,
                        backgroundColor: "#F0F0F0",
                        borderRadius: 4,
                      }}
                    >
                      <View
                        style={{
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: statusColor,
                          width: `${progressPct}%`,
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 11,
                          color: "#888",
                        }}
                      >
                        Balance
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 15,
                          color: "#272757",
                        }}
                      >
                        ₦{formatNumberToThousands(prop.balance ?? 0)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 13,
                          color: statusColor,
                        }}
                      >
                        View Details
                      </Text>
                      <Feather
                        name="arrow-right"
                        size={14}
                        color={statusColor}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PiolandDashboard;
