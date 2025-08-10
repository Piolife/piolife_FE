import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";

const Index = () => {
  const [initialRoute, setInitialRoute] = useState<
    "/welcome" | "/login" | null
  >(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setInitialRoute("/welcome");
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setInitialRoute("/login");
        }
      } catch (error) {
        console.error("Failed to check app launch status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
};

export default Index;
