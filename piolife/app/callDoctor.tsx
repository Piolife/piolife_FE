import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Pressable,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { CustomFlatList } from "@/components/reusables";
import { CallDoc } from "@/components/flatListItems/items";

const CallDoctor = () => {
  const handlePrevious = () => {
    router.back();
  };
  const { specialtyId, name, doctors } = useLocalSearchParams<{
    specialtyId: string;
    name?: string;
    doctors?: string;
  }>();

  const normalizedDoctors =
    typeof doctors === "string"
      ? doctors
      : Array.isArray(doctors)
      ? doctors[0] // take the first item if array
      : "";

  const selectedDoctors = normalizedDoctors
    ? JSON.parse(decodeURIComponent(normalizedDoctors))
    : [];

  const matchedUsers = selectedDoctors.filter((u: any) =>
    u.specialty.includes(specialtyId)
  );

  return (
    <SafeAreaView
      className="flex-1 bg-[#fffff0]"
      >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[24px]">
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
        <View className="flex flex-col gap-[24px]">
          <Text
            className="text-[#000000] text-[16px] leading-[24px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            {name}
          </Text>
          <View className="py-[4px] flex flex-col gap-[16px]">
            <CustomFlatList
              data={matchedUsers || []}
              renderItem={({ item }: any) => {
                return (
                  <CallDoc
                    specialtyId={specialtyId}
                    username={item.username}
                    profilePicture={item.profilePicture}
                    doctorId={item._id}
                    languageProficiency={item.languageProficiency}
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
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
export default CallDoctor;
