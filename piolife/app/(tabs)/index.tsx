import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import {
  ClientMenu,
  ClientScreen,
  DoctorScreen,
  Stat,
} from "@/components/reusables";

const Index = () => {
  const [role, setRole] = useState<string>("doctor");
  interface RecentConsultationsProps {
    patient: string;
    callType: string;
  }
  const recent = [
    {
      patient: "Juliana Ify",
      callType: "Audio call",
    },
    {
      patient: "Miriam Bello",
      callType: "Video call",
    },
  ];
  const RecentConsultations = ({
    patient,
    callType,
  }: RecentConsultationsProps) => {
    return (
      <Pressable
        className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
        onPress={() => {
          router.push("/clientSignup");
        }}
        style={[styles.shadowProp]}
      >
        <View className="flex flex-col gap-[8px]">
          <Text
            className="text-[#272757] text-[14px] leading-[20px]  "
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            {patient}
          </Text>
          <Text
            className="text-[#272757] text-[12px] leading-[20px]  "
            style={{ fontFamily: "Inter_400Regular" }}
          >
            {callType}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color="black" />
      </Pressable>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-[#fffff0]">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <View className="flex flex-row items-center justify-between mt-4">
          <View className="flex w-[80%]">
            <View className="flex flex-row gap-[16px]">
              <FontAwesome name="user" size={50} color="#ccc" />

              <View className="flex flex-col gap-[4px] py-[4px]">
                <Text
                  className="text-[#030319] text-[16px] leading-[19px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Hi, Kelvin
                </Text>
                <Text
                  className="text-[#2a2a2a] text-[14px] leading-[17px] "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  ID: KEL123BIA
                </Text>
              </View>
            </View>
          </View>
          <View className="flex w-[20%] flex-row justify-end">
            <Pressable
              onPress={() => {
                router.push("/notification");
              }}
              className="flex flex-col justify-center items-center rounded-[8px] border-[#2727571A] border-[1px] w-[32] h-[32px]"
            >
              <Octicons name="bell" size={24} color="#272757" />
            </Pressable>
          </View>
        </View>
        <View className="flex flex-col gap-[16px]">
          {role === "client" && (
            <Text
              className="text-[#272757] text-[18px] leading-[17px] "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Actions
            </Text>
          )}
          {role === "client" && <ClientScreen />}
          {role === "doctor" && <DoctorScreen balance={3000} />}
          {role === "doctor" && <Stat />}
        </View>

        {role === "client" && <ClientMenu />}
        {role === "doctor" && (
          <View className="flex flex-col gap-[20px]">
            <Text
              className="text-[#272757] text-[18px] leading-[17px] "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Recent Consultations
            </Text>
            <View className="flex flex-col gap-[16px]">
              <FlatList
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                horizontal={false}
                ListFooterComponent={<View style={{ height: 650 }}></View>}
                renderItem={({ item }) => (
                  <RecentConsultations
                    patient={item.patient}
                    callType={item.callType}
                  />
                )}
                data={recent}
              />
            </View>
          </View>
        )}
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
  },
});
export default Index;
