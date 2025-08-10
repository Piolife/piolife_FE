import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { User } from "@/services/core/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0e16ff",
        tabBarInactiveTintColor: "#a6a0a0",
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}
    >
      <Toast />
      <Tabs.Screen
        name="refer"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo
              name={user?.role === "medical_practitioner" ? "phone" : "share"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={32} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
