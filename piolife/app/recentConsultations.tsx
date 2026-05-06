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
import {
  ConsultationHistory,
  HistoryWallet,
} from "@/components/flatListItems/items";
import { FontAwesome } from "@expo/vector-icons";
const RecentConsultations = () => {
  const [user, SetUser] = useState<User>();
  const token = user?.token;
  const { data, loading, error } = useFetchData<any>(
    user ? `${API_URL}/api/v12/sessions/consultations/user/${user.id}` : "",
    { token }
  );

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        SetUser(user);
      }
    };
    loadUser();
    AsyncStorage.setItem("hasLaunched", "launched");
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
      <View className="py-[8px] px-[4%] gap-[16px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-12"
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
        <Text className="text-[#272757] text-[18px] ">
          Recent Consultations
        </Text>
        <CustomFlatList
          data={
            data
              ?.slice() // copy so you don't mutate original
              ?.sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              ) || []
          }
          renderItem={({ item }: { item: any }) => (
            <ConsultationHistory
              amount={item.medicalIssue.name}
              type={item.practitioner.username}
              timestamp={item.createdAt}
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
export default RecentConsultations;
