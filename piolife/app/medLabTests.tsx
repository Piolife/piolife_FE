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
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { HistoryWalletType, User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { CustomFlatList } from "@/components/reusables";
import { getCurrentLocation } from "@/components/reusables";

import Toast, { BaseToastProps } from "react-native-toast-message";

import Checkbox from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
const NearbyMedLab = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, SetUser] = useState<User>();
  const [errors, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorz, setErrors] = useState<Partial<any>>({});

  const token = user?.token;
  const { data, loading, error } = useFetchData<any>(
    location ? `${API_URL}/api/v12/medlab-stock/user/${id}` : "",
    { token }
  );
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/medlab-stock/orders`, true);

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
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleAddTestOrder = async () => {
    try {
      let response;
      const trimmedData = {
        testIds: selected,
        userId: user?.id,
        medLabId: id,
      };
      console.log("trimmedData", trimmedData);
      response = await postData(trimmedData);

      if (response) {
        router.push("/nearbyMedlab");
        setSelected([]);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err.message,
        position: "top",
        topOffset: 80,
      });
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white px-[4%]">
        {/* Items list */}
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }} // leave space for floating button
          renderItem={({ item }) => (
            <View className="flex-row items-center p-4 border-b border-gray-200">
              <Checkbox
                value={selected.includes(item._id)}
                onValueChange={() => toggleSelect(item._id)}
              />
              <Text className="ml-3 text-base">{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={
            !loading && (
              <Text className="text-center text-gray-500 mt-10">
                No stock items available
              </Text>
            )
          }
        />

        {/* Floating button */}
        <View className="absolute bottom-5 left-0 right-0 items-center">
          <Pressable
            onPress={handleAddTestOrder}
            disabled={selected.length === 0}
            className={`px-6 py-3 rounded-2xl shadow-lg ${
              selected.length === 0 ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-semibold text-lg">Proceed</Text>
          </Pressable>
        </View>
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
export default NearbyMedLab;
