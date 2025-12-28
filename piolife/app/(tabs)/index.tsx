import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
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
  formatNumberToThousands,
} from "@/components/reusables";
import { useFetchData } from "@/services/api/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, wallet } from "@/services/core/types";
import { API_URL } from "@/constants/api";
const Index = () => {
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
    AsyncStorage.setItem("hasLaunched", "launched");
  }, []);

  const token = user?.token;
  const { data, loading, error } = useFetchData<User>(
    user ? `${API_URL}/api/v12/users/${user.id}` : "",
    { token }
  );
  const {
    data: walletData,
    loading: isLoading,
    error: isError,
    refetch,
  } = useFetchData<wallet>(
    user ? `${API_URL}/api/v12/wallet/${user.id}/balance` : "",
    { token }
  );
  const {
    data: emergencyData,
    loading: emergencyLoading,
    error: emergencyError,
  } = useFetchData<any>(
    user ? `${API_URL}/api/v12/emergency-stock/emergencies/${user.id}` : "",
    { token }
  );
  if (error) {
    Alert.alert(error);
  }
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
  if (loading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const RecentConsultations = ({
    patient,
    callType,
  }: RecentConsultationsProps) => {
    return (
      <Pressable
        className="rounded-[4px] border-[#DADADA80] border-[1px] p-[16px] flex flex-row gap-[16px] items-center bg-white justify-between"
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
    <SafeAreaView
      className={`flex-1 bg-[#fffff0]`}
      style={{ paddingTop: Platform.OS === "android" ? 20 : 0 }}
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View className="py-[16px] px-[4%] gap-[32px]">
        <View className="flex flex-row items-center justify-between mt-8">
          <View className="flex w-[80%]">
            <View className="flex flex-row gap-[16px]">
              {data ? (
                <Image
                  source={{
                    uri: [
                      "emergency_services",
                      "pharmacy_services",
                      "medical_lab_services",
                    ].includes(data?.role ?? "")
                      ? data?.logo
                      : data?.profilePicture,
                  }}
                  className="w-[56px] h-[56px] rounded-full"
                />
              ) : (
                <FontAwesome name="user" size={50} color="#ccc" />
              )}

              <View className="flex flex-col gap-[4px] py-[4px] flex-1">
                <Text
                  className="text-[#030319] text-[16px] leading-[19px] "
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Hi,{" "}
                  {data?.role === "pharmacy_services"
                    ? data?.pharmacyName
                    : data?.role === "medical_lab_services"
                    ? data?.medicalLabName
                    : data?.firstName}
                </Text>
                <Text
                  className="text-[#2a2a2a] text-[14px] leading-[17px] "
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  ID: {data?.username}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex w-[20%] flex-row justify-end">
            <Pressable
              // onPress={() => {
              //   router.push("/notification");
              // }}
              className="flex flex-col justify-center items-center rounded-[8px] border-[#2727571A] border-[1px] w-[32] h-[32px]"
            >
              <Octicons name="bell" size={24} color="#272757" />
            </Pressable>
          </View>
        </View>
        <View className="flex flex-col gap-[16px]">
          {user?.role === "client" && (
            <Text
              className="text-[#272757] text-[18px] leading-[17px] "
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Actions
            </Text>
          )}
          {user?.role === "client" && <ClientScreen />}
          {user?.role &&
            [
              "medical_practitioner",
              "emergency_services",
              "pharmacy_services",
              "medical_lab_services",
            ].includes(user.role) && (
              <DoctorScreen
                balance={formatNumberToThousands(walletData?.balance)}
              />
            )}

          {user?.role === "medical_practitioner" && (
            <Stat text="Consultations" serve={8} />
          )}
          {user?.role === "pharmacy_services" && (
            <View>
              <View className="flex flex-row justify-between my-4">
                <Pressable
                  onPress={() => {
                    router.push("/pharmServices");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Services
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/drugs");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Drugs
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/addDrug");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Add Drug
                  </Text>
                </Pressable>
              </View>
              <Stat text="Served" serve={data?.consultationCount} />
            </View>
          )}
          {user?.role === "medical_lab_services" && (
            <View>
              <View className="flex flex-row justify-between my-4">
                <Pressable
                  onPress={() => {
                    router.push("/medlabServices");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Services
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/tests");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Tests
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/addTest");
                  }}
                  className="flex flex-col justify-center items-center rounded-[8px] border-[#0E16FF] border-[1px]  h-[32px] px-[16px] bg-[#0E16FF] w-[30%]"
                >
                  <Text
                    className="text-[#ffffff] text-[12px] leading-[17px] "
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Add Test
                  </Text>
                </Pressable>
              </View>
              <Stat text="Served" serve={9} />
            </View>
          )}
          {user?.role === "emergency_services" && (
            <View className="flex flex-row justify-between my-4">
              <Stat
                text="Served"
                serve={emergencyData?.length}
                onPress={() => {
                  router.push("/emergencyServices");
                }}
              />
            </View>
          )}
        </View>

        {user?.role === "client" && <ClientMenu />}
        {user?.role === "medical_practitioner" && (
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
export default Index;
