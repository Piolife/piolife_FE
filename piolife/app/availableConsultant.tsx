import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { usePostData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import { HistoryWalletType, User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomFlatList } from "@/components/reusables";
import { AvailableDoc, HistoryWallet } from "@/components/flatListItems/items";

const error = require("../assets/images/error.png");
const AvailableConsultant = () => {
  const handlePrevious = () => {
    router.back();
  };
  const {
    data: register,
    loading: isLoading,
    postData,
  } = usePostData(`${API_URL}/api/v12/sessions/practitioners`);

  const { selected, selectedId, doctors } = useLocalSearchParams();

  const selectedString =
    typeof selected === "string"
      ? selected
      : Array.isArray(selected)
      ? selected[0]
      : "";

  const normalizedDoctors =
    typeof doctors === "string"
      ? doctors
      : Array.isArray(doctors)
      ? doctors[0] // take the first item if array
      : "";

  const selectedDoctors = normalizedDoctors
    ? JSON.parse(decodeURIComponent(normalizedDoctors))
    : [];

  const selectedArray = selectedString
    ? JSON.parse(decodeURIComponent(selectedString))
    : [];
  const ids = selectedArray.map((item: any) => item._id);
  console.log(ids);
  const [user, SetUser] = useState<User>();
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

  useEffect(() => {
    const loadUserAndFetch = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        SetUser(user);

        const payload = {
          userId: user.id,
          languageProficiency: [selectedId],
          specialty: ids,
        };

        try {
          const res = await postData(payload);
        } catch (err) {
          console.log("err", err);
        }
      }
    };

    loadUserAndFetch();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      style={{ paddingTop: Platform.OS === "android" ? 10 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[24px] pt-16">
        <Pressable
          className="flex flex-row items-center gap-[16px]"
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
        <View className="flex flex-col gap-[24px]">
          <Text
            className="text-[#000000] text-[14px] leading-[150%]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Click specialty to speak with the available consultants now
          </Text>
          <View className="rounded-[8px] p-[16px] gap-[16px] flex flex-row bg-[#F0F8FF66] items-center">
            <Image source={error} className="w-[24px] h-[24px]" />
            <Text
              className="text-[#000000] text-[10px] leading-[100%] flex-1"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Do not disclose your mobile number, email, or residential address
              to the consultant. Piolife will not be held reponsible for any
              eventuality resulting from sharing your personal data to the
              consultant.
            </Text>
          </View>
          <View>
            <CustomFlatList
              data={selectedArray || []}
              renderItem={({ item }: any) => {
                const hasMatch = selectedDoctors.some((doc: any) =>
                  (doc.specialty ?? []).includes(item._id)
                );

                return (
                  <AvailableDoc
                    specialtyId={item._id}
                    name={item.name}
                    hasMatch={hasMatch}
                    doctors={doctors}
                  />
                );
              }}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: "center" }}>No items found.</Text>
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ height: 32 }} />}
            />
          </View>
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
    elevation: 5,
  },
});
export default AvailableConsultant;
