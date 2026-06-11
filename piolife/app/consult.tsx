import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Pressable,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

type OfficeButton = {
  id: number;
  text: string;
  emoji: string;
  link?: string;
  comingSoon?: boolean;
};

const buttons: OfficeButton[] = [
  { id: 1, text: "Hospital/Medic", emoji: "🏥", link: "/hospitalOptions" },
  { id: 2, text: "Emergency office", emoji: "🚨", link: "/emergencyMenu" },
  { id: 3, text: "Real Estate (pioland)", emoji: "🏠", link: "/realEstate" },
  { id: 4, text: "Flight booking", emoji: "✈️", comingSoon: true },
  { id: 5, text: "E-Commerce Room", emoji: "🛒", comingSoon: true },
  { id: 6, text: "Hotel booking", emoji: "🏨", comingSoon: true },
  { id: 7, text: "Insurance office", emoji: "🛡️", comingSoon: true },
  { id: 8, text: "Entertainment industry", emoji: "🎬", comingSoon: true },
  { id: 9, text: "Transportation(Biospace)", emoji: "🚗", comingSoon: true },
  { id: 10, text: "Chambers", emoji: "⚖️", comingSoon: true },
  { id: 11, text: "Media House", emoji: "📺", comingSoon: true },
  { id: 12, text: "Government offices", emoji: "🏛️", comingSoon: true },
];

const Consult = () => {
  const handlePress = (button: OfficeButton) => {
    if (button.comingSoon || !button.link) {
      Alert.alert(
        "Coming Soon",
        `${button.text} will be available in a future update.`,
        [{ text: "OK" }],
      );
      return;
    }
    router.push(button.link as any);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fffff0"
        }}
    >
      <StatusBar style="light" backgroundColor="#0E16FF" />

      <View
        style={{
          backgroundColor: "#0E16FF",
          paddingTop: Platform.OS === "android" ? 24 : 12,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fffff0" />
        </Pressable>
        <View>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 20,
              color: "#fffff0",
            }}
          >
            Offices
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,240,0.7)",
              marginTop: 2,
            }}
          >
            Select a service to get started
          </Text>
        </View>
      </View>

      <FlatList
        data={buttons}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingBottom: 48,
          paddingHorizontal: 12,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 14,
        }}
        renderItem={({ item: button }) => {
          const active = !!button.link && !button.comingSoon;
          return (
            <Pressable
              onPress={() => handlePress(button)}
              style={({ pressed }) => ({
                flex: 1,
                minHeight: 100,
                marginHorizontal: 4,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                paddingHorizontal: 6,
                backgroundColor: active ? "#0E16FF" : "#fff",
                borderWidth: active ? 0 : 1.5,
                borderColor: "#E8E8E8",
                opacity: pressed ? 0.85 : 1,
                shadowColor: "#272757",
                shadowOffset: { width: 0, height: active ? 4 : 1 },
                shadowOpacity: active ? 0.18 : 0.05,
                shadowRadius: active ? 10 : 4,
                elevation: active ? 5 : 1,
              })}
            >
              <Text
                style={{ fontSize: 28, marginBottom: 6, textAlign: "center" }}
              >
                {button.emoji}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 11,
                  color: active ? "#000000" : "#272757",
                  textAlign: "center",
                  lineHeight: 15,
                }}
              >
                {button.text}
              </Text>
              {button.comingSoon && (
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 9,
                    color: "#FF6B00",
                    marginTop: 4,
                    letterSpacing: 0.4,
                    textAlign: "center",
                  }}
                >
                  COMING SOON
                </Text>
              )}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Consult;
