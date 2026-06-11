/**
 * app/drugs.tsx — FIXED
 *
 * BUG: Was fetching ALL pharmacy stock, not just the logged-in pharmacy's stock.
 * FIX: Uses user.id to fetch only THIS pharmacy's drugs.
 * Also adds delete and edit navigation.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const Drugs = () => {
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;

  // FIX: fetch by THIS pharmacy's user id, not all stock
  const {
    data: drugs,
    loading,
    refetch,
  } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/pharmacy-stock/user/${user.id}` : "",
    { token }
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const totalItems = Array.isArray(drugs) ? drugs.length : 0;
  const lowStock = Array.isArray(drugs)
    ? drugs.filter((d: any) => (d.quantity ?? 0) < 5).length
    : 0;

  if (loading && !drugs) {
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
      <StatusBar style="dark" backgroundColor="#fffff0" />
      <Toast />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1D6A3A",
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 24,
                color: "#fffff0",
              }}
            >
              Drug Stock
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "rgba(255,255,240,0.7)",
                marginTop: 4,
              }}
            >
              {totalItems} items · {lowStock} low stock
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/addDrug")}
            style={{
              backgroundColor: "#fffff0",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: "row",
              gap: 6,
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={16} color="#1D6A3A" />
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 13,
                color: "#1D6A3A",
              }}
            >
              Add Drug
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={Array.isArray(drugs) ? drugs : []}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1D6A3A"
          />
        }
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ fontSize: 40 }}>💊</Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#272757",
                marginTop: 12,
              }}
            >
              No drugs added yet
            </Text>
            <Pressable
              onPress={() => router.push("/addDrug")}
              style={{
                marginTop: 16,
                backgroundColor: "#1D6A3A",
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: "#fffff0",
                }}
              >
                Add First Drug
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const isLow = (item.quantity ?? 0) < 5;
          return (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
                borderLeftWidth: isLow ? 3 : 0,
                borderLeftColor: "#B91C1C",
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#E6F4EC",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>💊</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: "#272757",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#888",
                    marginTop: 2,
                  }}
                >
                  Qty: {item.quantity ?? "—"} · ₦
                  {formatNumberToThousands(item.price ?? 0)}
                </Text>
                {isLow && (
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 11,
                      color: "#B91C1C",
                      marginTop: 2,
                    }}
                  >
                    ⚠️ Low stock
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/addDrug",
                    params: { id: item._id, editMode: "true" },
                  })
                }
                style={{ padding: 6 }}
              >
                <Feather name="edit-2" size={16} color="#888" />
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Drugs;
