// FIXED app/nearbyPharmacy.tsx
// Bug 1: NearbyPharms was called with officerInCharge as medicalLabName — showed wrong name
// Bug 2: navigates to medLabTests for pharmacy — should go to pharmacyDrugs
// Bug 3: bg-white, not bg-[#fffff0] theme
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation, CustomFlatList } from "@/components/reusables";
import { NearbyPharms } from "@/components/flatListItems/items";
import { Feather } from "@expo/vector-icons";

const NearbyPharmacy = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      const coords = await getCurrentLocation();
      setLocation(coords);
    })();
  }, []);

  const token = user?.token;
  const { data, loading } = useFetchData<any>(
    location
      ? `${API_URL}/api/v12/users/nearby-specialized?lat=${location.latitude}&lng=${location.longitude}&radius=50&role=pharmacy_services`
      : "",
    { token }
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 28 : 12,
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
            marginBottom: 4,
          }}
        >
          Nearby
        </Text>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 26,
            color: "#fffff0",
          }}
        >
          Recommended Pharmacies
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          Within 50km of your location
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="#0E16FF" />
          </View>
        ) : (
          <CustomFlatList
            data={data || []}
            renderItem={({ item }: { item: any }) => (
              // FIXED: pass pharmacyName AND officerInCharge separately
              <NearbyPharms
                pharmacyName={
                  item.pharmacyName ?? item.officerInCharge ?? "Pharmacy"
                }
                officerInCharge={item.officerInCharge ?? "—"}
                onPress={() =>
                  // FIXED: was going to /medLabTests — now goes to pharmacy drugs
                  router.push({
                    pathname: "/pharmDrugs",
                    params: {
                      id: item._id,
                      name: item.pharmacyName ?? item.officerInCharge,
                    },
                  })
                }
              />
            )}
            ListEmptyComponent={() => (
              <View style={{ alignItems: "center", paddingTop: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>💊</Text>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 15,
                    color: "#888",
                  }}
                >
                  No pharmacies found nearby
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    color: "#aaa",
                    marginTop: 4,
                  }}
                >
                  Try increasing the search radius
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 32 }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NearbyPharmacy;
