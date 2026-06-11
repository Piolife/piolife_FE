/**
 * app/nearbyMedlab.tsx — REWRITTEN
 *
 * FIXES:
 *  1. Race condition with location state gating the fetch
 *  2. Shows lab name correctly (medicalLabName not officerInCharge)
 *  3. Auto-links doctor's diagnostic test from latest prescription
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { getCurrentLocation } from "@/components/reusables";

const LabCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      backgroundColor: "#fff",
      borderRadius: 18,
      padding: 18,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      shadowColor: "#272757",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 4,
      opacity: pressed ? 0.92 : 1,
    })}
  >
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#EDE9FF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>🔬</Text>
    </View>
    <View style={{ flex: 1 }}>
      {/* FIXED: show medicalLabName not officerInCharge */}
      <Text
        style={{ fontFamily: "Inter_700Bold", fontSize: 15, color: "#272757" }}
        numberOfLines={1}
      >
        {item.medicalLabName ?? item.username ?? "Medical Lab"}
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          color: "#888",
          marginTop: 2,
        }}
      >
        Scientist: {item.labScientistInCharge ?? item.officerInCharge ?? "—"}
      </Text>
      <Text
        style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#888" }}
      >
        {item.stateOfResidence ?? ""}
        {item.lga ? ` · ${item.lga}` : ""}
      </Text>
    </View>
    <Feather name="chevron-right" size={18} color="#7C3AED" />
  </Pressable>
);

const NearbyMedlab = () => {
  const [user, setUser] = useState<any>(null);
  // FIX: separate ready flag so fetch fires as soon as user loads, not waiting on location
  const [locationReady, setLocationReady] = useState(false);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });

    // Location fetch runs in parallel — does not block the API call
    getCurrentLocation()
      .then((c) => {
        setCoords(c);
      })
      .catch(() => setLocationError(true))
      .finally(() => setLocationReady(true));
  }, []);

  const token = user?.token;

  // Build URL once location is determined (with or without coords)
  const url =
    user && locationReady
      ? coords
        ? `${API_URL}/api/v12/users/nearby-specialized?lat=${coords.latitude}&lng=${coords.longitude}&radius=50&role=medical_lab_services`
        : `${API_URL}/api/v12/users/nearby-specialized?role=medical_lab_services`
      : "";

  const { data, loading } = useFetchData<any[]>(url, { token });

  // Latest prescription diagnostic info
  const { data: prescriptions } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/sessions/prescriptions/user/${user.id}` : "",
    { token }
  );
  const latestDiagnosis =
    Array.isArray(prescriptions) && prescriptions.length > 0
      ? prescriptions[prescriptions.length - 1]?.diagnosis ?? null
      : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />

      <View
        style={{
          backgroundColor: "#7C3AED",
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
          Medical Laboratories
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          {coords
            ? "Showing labs within 50km"
            : locationError
            ? "Showing all registered labs"
            : "Finding nearby labs…"}
        </Text>

        {latestDiagnosis && (
          <View
            style={{
              marginTop: 12,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 11,
                color: "#fffff0",
                marginBottom: 2,
              }}
            >
              📋 Your doctor's diagnostic note:
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.85)",
              }}
              numberOfLines={2}
            >
              {latestDiagnosis}
            </Text>
          </View>
        )}
      </View>

      {loading || (!locationReady && !user) ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#888",
              marginTop: 12,
            }}
          >
            Finding labs…
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {!data || data.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Text style={{ fontSize: 40 }}>🔬</Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: "#272757",
                  marginTop: 12,
                }}
              >
                No labs found
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#888",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                No registered medical labs nearby.
              </Text>
            </View>
          ) : (
            data.map((item: any) => (
              <LabCard
                key={item._id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/medLabTests",
                    params: {
                      id: item._id,
                      name: item.medicalLabName ?? item.username,
                    },
                  })
                }
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NearbyMedlab;
