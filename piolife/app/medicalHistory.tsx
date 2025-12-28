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
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/services/core/types";

const consult = require("../assets/images/image 48-2.png");

const MedicalHistory = () => {
  const [user, setUser] = useState<any>();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const dummyData: Record<number, any[]> = {
    2024: [
      {
        id: "mh1",
        doctor: "Dr. Jane Doe",
        diagnosis: "Malaria",
        date: "2024-03-10",
        complaint: "High fever, chills, and headache",
        prescription: "Artemether-Lumefantrine, Paracetamol",
        prognosis: "Improved after 5 days of treatment",
        labResultUrl: "https://example.com/labresult1.pdf",
      },
    ],
    2025: [
      {
        id: "mh2",
        doctor: "Dr. Ayo Bamidele",
        diagnosis: "Allergy",
        date: "2025-01-16",
        complaint: "Sneezing and watery eyes for 2 weeks",
        prescription: "Cetirizine 10mg daily",
        prognosis: "Stable condition, symptoms resolved",
        labResultUrl: "https://example.com/labresult2.pdf",
      },
    ],
  };

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const handlePrevious = () => {
    router.back();
  };

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleYearPress = (year: number) => {
    setSelectedYear(year === selectedYear ? null : year);
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/medicalHistoryDetail`,
          params: { ...item },
        })
      }
      className="bg-[#f7f7f7] p-4 rounded-lg mb-3"
    >
      <Text className="text-[#272757] font-semibold">{item.diagnosis}</Text>
      <Text className="text-gray-500 text-sm">{item.date}</Text>
      <Text className="text-gray-700 text-sm">By {item.doctor}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-[16px] px-[4%] mt-8">
        <Pressable
          className="flex flex-row items-center gap-[16px]"
          onPress={handlePrevious}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Consult
          </Text>
        </Pressable>

        <View className="mt-8">
          <Text
            className="text-[#272757] text-[18px]"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Medical History
          </Text>

          <View className="flex flex-wrap flex-row justify-between mt-4">
            {years.map((year, index) => (
              <Pressable
                key={year}
                onPress={() => handleYearPress(year)}
                className={`w-[48%] py-[16px] rounded-lg items-center ${
                  selectedYear === year ? "bg-[#0e16ff]" : "bg-[#f5f5f5]"
                } mb-4`}
              >
                <Text
                  className={`text-[16px] ${
                    selectedYear === year ? "text-white" : "text-[#272757]"
                  }`}
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {year}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedYear && (
            <FlatList
              data={dummyData[selectedYear] || []}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text className="text-gray-500 mt-4">
                  No medical history found for {selectedYear}.
                </Text>
              }
            />
          )}
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
export default MedicalHistory;
