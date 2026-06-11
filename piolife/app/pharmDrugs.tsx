// app/pharmacyDrugs.tsx — Client selects drugs from a pharmacy after prescription
// PRD: "pharmacy services should have direct link to doctor's recent prescribed drugs"
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  ActivityIndicator,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useFetchData, usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { formatNumberToThousands } from "@/components/reusables";
import Toast from "react-native-toast-message";

const PharmacyDrugs = () => {
  const { id: pharmacyId, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [wantDelivery, setWantDelivery] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const token = user?.token;
  const { data: drugs, loading } = useFetchData<any>(
    pharmacyId ? `${API_URL}/api/v12/pharmacy-stock/user/${pharmacyId}` : "",
    { token }
  );
  // Latest prescription for this client
  const { data: prescriptions } = useFetchData<any[]>(
    user ? `${API_URL}/api/v12/sessions/prescriptions/user/${user.id}` : "",
    { token }
  );
  const prescription =
    Array.isArray(prescriptions) && prescriptions.length > 0
      ? prescriptions[prescriptions.length - 1]
      : null;
  const { postData: placeOrder, loading: ordering } = usePostData(
    `${API_URL}/api/v12/pharmacy-stock/orders`,
    true
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev[id]) {
        const n = { ...prev };
        delete n[id];
        return n;
      }
      return { ...prev, [id]: 1 };
    });
  };

  const total = Object.entries(selected).reduce((sum, [id, qty]) => {
    const drug = drugs?.find((d: any) => d._id === id);
    return sum + (drug?.price ?? 0) * qty;
  }, 0);

  const handleOrder = async () => {
    if (Object.keys(selected).length === 0) {
      Toast.show({
        type: "error",
        text1: "Select at least one drug",
        position: "bottom",
      });
      return;
    }
    try {
      await placeOrder({
        drugIds: Object.keys(selected),
        quantities: selected,
        userId: user?.id,
        pharmacyId,
        withDelivery: wantDelivery,
        prescriptionId: prescription?._id,
      });
      Toast.show({
        type: "success",
        text1: "Order placed!",
        text2: "Payment deducted from wallet",
        position: "bottom",
      });
      setTimeout(() => router.back(), 1200);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Order failed",
        text2: e.message,
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffff0" }}>
      <StatusBar style="dark" />
      <Toast />
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
            fontFamily: "Inter_800ExtraBold",
            fontSize: 22,
            color: "#fffff0",
          }}
        >
          {name}
        </Text>
        {prescription && (
          <View
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: "#fffff0",
              }}
            >
              📋 Prescription from Dr.
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "rgba(255,255,240,0.8)",
                marginTop: 2,
              }}
              numberOfLines={2}
            >
              {prescription.prescription}
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0E16FF" />
        </View>
      ) : (
        <FlatList
          data={drugs ?? []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
          renderItem={({ item }) => {
            const isSelected = !!selected[item._id];
            return (
              <Pressable
                onPress={() => toggle(item._id)}
                style={{
                  backgroundColor: isSelected ? "#0E16FF" : "#fff",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1.5,
                  borderColor: isSelected ? "#0E16FF" : "#E0E0E0",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 15,
                      color: isSelected ? "#fffff0" : "#272757",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      color: isSelected ? "rgba(255,255,240,0.7)" : "#888",
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 15,
                    color: isSelected ? "#fffff0" : "#0E16FF",
                    marginLeft: 12,
                  }}
                >
                  ₦{formatNumberToThousands(item.price)}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
              No drugs listed
            </Text>
          )}
        />
      )}

      {/* Bottom order bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          padding: 20,
        }}
      >
        <Pressable
          onPress={() => setWantDelivery((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: "#0E16FF",
              backgroundColor: wantDelivery ? "#0E16FF" : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {wantDelivery && <Feather name="check" size={12} color="#fffff0" />}
          </View>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              color: "#272757",
            }}
          >
            Add home delivery
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: "#888",
            }}
          >
            Total ({Object.keys(selected).length} items
            {wantDelivery ? " + delivery" : ""})
          </Text>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 18,
              color: "#0E16FF",
            }}
          >
            ₦{formatNumberToThousands(total)}
          </Text>
        </View>
        <Pressable
          onPress={handleOrder}
          disabled={ordering || Object.keys(selected).length === 0}
          style={{
            backgroundColor:
              Object.keys(selected).length === 0 ? "#CCC" : "#0E16FF",
            borderRadius: 14,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ordering ? (
            <ActivityIndicator color="#fffff0" />
          ) : (
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 15,
                color: "#fffff0",
              }}
            >
              Place Order — Pay from Wallet
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PharmacyDrugs;
