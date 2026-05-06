import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { HistoryWalletType, User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { CustomFlatList } from "@/components/reusables";
import { HistoryWallet } from "@/components/flatListItems/items";
const WalletHistory = () => {
  const [user, SetUser] = useState<User>();
  const token = user?.token;
  const { data, loading, error } = useFetchData<any>(
    user ? `${API_URL}/api/v12/wallet/transactions/${user.id}` : "",
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
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[8px] px-[4%] gap-[16px]">
        <Text className="text-[#272757] text-[18px] ">Recent Transactions</Text>
        <CustomFlatList
          data={
            data?.transactions
              ?.slice() // copy so you don't mutate original
              ?.sort(
                (a: any, b: any) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              ) || []
          }
          renderItem={({ item }: { item: HistoryWalletType }) => (
            <HistoryWallet
              amount={item.amount}
              type={item.type}
              timestamp={item.timestamp}
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
export default WalletHistory;
