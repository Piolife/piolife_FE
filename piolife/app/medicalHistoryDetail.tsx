import React from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const MedicalHistoryDetails = () => {
  const params = useLocalSearchParams<{
    id: string;
    doctor: string;
    diagnosis: string;
    complaint: string;
    prescription: string;
    prognosis: string;
    date: string;
    labResultUrl: string;
  }>();

  const handleDownload = async () => {
    if (params.labResultUrl) {
      await Linking.openURL(params.labResultUrl);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-[4%] py-[16px]">
        <Pressable
          className="flex flex-row items-center gap-[16px] mb-6"
          onPress={() => router.back()}
        >
          <FontAwesome name="angle-left" size={24} color="black" />
          <Text
            className="text-[#272757] text-[16px]"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Back
          </Text>
        </Pressable>

        <Text className="text-[20px] text-[#272757] font-bold mb-4">
          Consultation Details
        </Text>

        <View className="bg-[#f7f7f7] p-4 rounded-lg mb-6">
          <Text className="text-[#272757] font-semibold text-[16px] mb-2">
            Doctor: <Text className="text-gray-700">{params.doctor}</Text>
          </Text>
          <Text className="text-[#272757] font-semibold text-[16px] mb-2">
            Date: <Text className="text-gray-700">{params.date}</Text>
          </Text>
        </View>

        <View className="bg-[#ffffff] border border-[#eee] p-4 rounded-lg mb-4">
          <Text className="text-[#272757] font-semibold mb-1">Complaint</Text>
          <Text className="text-gray-700">{params.complaint}</Text>
        </View>

        <View className="bg-[#ffffff] border border-[#eee] p-4 rounded-lg mb-4">
          <Text className="text-[#272757] font-semibold mb-1">Diagnosis</Text>
          <Text className="text-gray-700">{params.diagnosis}</Text>
        </View>

        <View className="bg-[#ffffff] border border-[#eee] p-4 rounded-lg mb-4">
          <Text className="text-[#272757] font-semibold mb-1">
            Prescription
          </Text>
          <Text className="text-gray-700">{params.prescription}</Text>
        </View>

        <View className="bg-[#ffffff] border border-[#eee] p-4 rounded-lg mb-6">
          <Text className="text-[#272757] font-semibold mb-1">Prognosis</Text>
          <Text className="text-gray-700">{params.prognosis}</Text>
        </View>

        <Pressable
          onPress={handleDownload}
          className="bg-[#0e16ff] py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-[16px]">
            Download Lab Result (PDF)
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalHistoryDetails;
