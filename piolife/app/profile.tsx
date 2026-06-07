import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useFetchData } from "@/services/api/request";
import { API_URL } from "@/constants/api";

const Row = ({ label, value }: { label: string; value?: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(39,39,87,0.06)",
    }}
  >
    <Text
      style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#888", flex: 1 }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        color: "#272757",
        flex: 2,
        textAlign: "right",
      }}
    >
      {value || "—"}
    </Text>
  </View>
);

const ProfileScreen = () => {
  const [stored, setStored] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setStored(JSON.parse(u));
    });
  }, []);

  const { data: user, loading } = useFetchData<any>(
    stored ? `${API_URL}/api/v12/users/${stored.id}` : "",
    { token: stored?.token }
  );

  const display = user ?? stored;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fffff0",
        paddingTop: Platform.OS === "android" ? 20 : 0,
      }}
    >
      <StatusBar style="dark" backgroundColor="#fffff0" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 28 : 16,
          paddingBottom: 48,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start", marginBottom: 16 }}
        >
          <Feather name="arrow-left" size={24} color="#fffff0" />
        </Pressable>

        {/* Avatar */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(255,255,240,0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: "rgba(255,255,240,0.5)",
          }}
        >
          {display?.profilePicture ? (
            <Image
              source={{ uri: display.profilePicture }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
          ) : (
            <Feather name="user" size={36} color="#fffff0" />
          )}
        </View>

        <Text
          style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#fffff0" }}
        >
          {display?.firstName} {display?.lastName}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "rgba(255,255,240,0.7)",
            marginTop: 4,
          }}
        >
          ID: {display?.username ?? "—"}
        </Text>
      </View>

      {loading && !display ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#0E16FF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              paddingHorizontal: 20,
              shadowColor: "#272757",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 14,
              elevation: 5,
            }}
          >
            <Row label="First Name" value={display?.firstName} />
            <Row label="Last Name" value={display?.lastName} />
            <Row label="Other Name" value={display?.otherName} />
            <Row label="Gender" value={display?.gender} />
            <Row label="Date of Birth" value={display?.dateOfBirth} />
            <Row label="Status" value={display?.maritalStatus} />
            <Row label="Email" value={display?.email} />
            <Row label="Phone" value={display?.phoneNumber} />
            <Row label="Country" value={display?.countryOfResidence} />
            <Row label="State" value={display?.stateOfResidence} />
            <Row label="Role" value={display?.role} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
