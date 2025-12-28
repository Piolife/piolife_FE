import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { CustomFlatList } from "@/components/reusables";
import {
  AddDrugFormProps,
  DrugItemType,
  DrugSoldType,
  HistoryWalletType,
  LoginFormProps,
  User,
} from "@/services/core/types";
import { validateAddDrugsForm, validateLoginForm } from "@/hooks/auth";
import { useFetchData, usePostData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { getCurrentLocation } from "@/components/reusables";
import { API_URL } from "@/constants/api";
import { FontAwesome } from "@expo/vector-icons";
import {
  DrugList,
  DrugSold,
  HistoryWallet,
} from "@/components/flatListItems/items";

export const toastConfig = {
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#fff",
        borderLeftColor: "red",
        zIndex: 9999,
        elevation: 9999,
        position: "absolute",
        top: 120,
      }}
      text1Style={{ color: "black", fontWeight: "bold" }}
      text2Style={{ color: "black" }}
    />
  ),
};
const drugsSold = [
  { percentage: 30, amount: 5000 },
  { percentage: 60, amount: 9000 },
  { percentage: 10, amount: 9000 },
  { percentage: 70, amount: 3000 },
  { percentage: 20, amount: 7000 },
  { percentage: 5, amount: 4000 },
];
const PharmServices = () => {
  const handlePrevious = () => {
    router.back();
  };
  const [user, SetUser] = useState<User>();
  const token = user?.token;
  const { data, loading, error } = useFetchData<any>(
    location ? `${API_URL}/api/v12/pharmacy-stock/sales/${user?.id}` : "",
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
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <View className="py-[16px] px-[4%] gap-[32px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mt-10"
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
        <View className="fle flex-row justify-end">
          <Pressable className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] ">
            <Text
              className="text-[#ffffff] text-[12px] leading-[17px] "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Prescriptions
            </Text>
          </Pressable>
        </View>
        <View className="flex flex-col ">
          <CustomFlatList
            data={data || []}
            renderItem={({ item }: { item: DrugSoldType }) => (
              <DrugSold
                totalAmount={item.totalAmount}
                percentage={item.percentage}
              />
            )}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: "center" }}>No items found.</Text>
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 70 }} />}
          />
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
export default PharmServices;
