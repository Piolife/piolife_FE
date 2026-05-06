import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { HistoryWalletType, User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { CustomFlatList } from "@/components/reusables";
import { getCurrentLocation } from "@/components/reusables";
import {
  ConsultationHistory,
  HistoryWallet,
  NearbyMeds,
  NearbyPharms,
} from "@/components/flatListItems/items";
import { FontAwesome } from "@expo/vector-icons";
const NearbyPharmacy = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, SetUser] = useState<User>();
  const [errors, setError] = useState<string | null>(null);

  const token = user?.token;
  const { data, loading, error } = useFetchData<any>(
    location
      ? `${API_URL}/api/v12/users/nearby-specialized?lat=${location.latitude}&lng=${location.longitude}&radius=50&role=pharmacy_services`
      : "",
    { token }
  );
  console.log("data jjjjj", data);
  useEffect(() => {
    (async () => {
      try {
        // Load user from storage
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          SetUser(user);
        }

        // Get current location
        const coords = await getCurrentLocation();
        setLocation(coords);

        // Mark that app has launched
        await AsyncStorage.setItem("hasLaunched", "launched");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const handlePrevious = () => {
    router.back();
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[8px] px-[4%] gap-[16px] mt-12">
        <Pressable
          className="flex flex-row items-center gap-[16px] "
          onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px] leading-[20px] text-center "
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>
        <Text className="text-[#272757] text-[18px] ">Recomended Pharmacy</Text>
        <CustomFlatList
          data={data || []}
          renderItem={({ item }: { item: any }) => (
            <NearbyPharms
              medicalLabName={item.officerInCharge}
              officerInCharge={item.officerInCharge}
              onPress={() =>
                router.push({
                  pathname: "/medLabTests", // <- the file under app/nextPage.tsx
                  params: { id: item._id }, // <- send ID
                })
              }
            />
          )}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center" }}>No items found.</Text>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{ height: 32 }} />}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
export default NearbyPharmacy;
