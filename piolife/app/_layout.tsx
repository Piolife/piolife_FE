import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import "react-native-reanimated";
import "../global.css";
import { Platform, View } from "react-native";
import { LogBox } from "react-native";
import { JsStack } from "@/components/JsStack";
import { io, Socket } from "socket.io-client";
import { Easing } from "react-native-reanimated";
import { StreamChat } from "stream-chat";

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { PaperProvider } from "react-native-paper";
import { getSocket } from "./weSocket";
const ROTATE_VALUES = ["60deg", "45deg", "30deg", "15deg", "0deg"];
const ANIMATION_DURATION = 400;
const STREAM_API_KEY = "fvct7vwrd7ps"; // safer than hardcoding
const chatClient = StreamChat.getInstance(STREAM_API_KEY);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import { BaseToast, ErrorToast } from "react-native-toast-message";
import Toast, { BaseToastProps } from "react-native-toast-message";
import React from "react";
import IncomingCallListener from "./IncomingCallHandler";
type EmergencyCustomEvent = {
  type: "custom";
  data: {
    type: "emergency_request";
    incidentLocation: { latitude: number; longitude: number };
    distance: number;
  };
};

export function useStreamProvider(providerId: string, providerToken: string) {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function connect() {
      try {
        await chatClient.connectUser(
          {
            id: providerId,
            name: "Provider Name", // optional
          },
          providerToken
        );

        const listener = chatClient.on("custom", (event) => {
          const customEvent = event as unknown as EmergencyCustomEvent;

          if (customEvent.data?.type === "emergency_request") {
            console.log("🚨 Emergency received:", customEvent.data);
            // You can trigger navigation here
          }
        });

        // store only the unsubscribe function
        unsubscribe = listener.unsubscribe;
      } catch (error) {
        console.error("Failed to connect to Stream:", error);
      }
    }

    connect();

    return () => {
      unsubscribe?.();
      chatClient.disconnectUser();
    };
  }, [providerId, providerToken]);
}
export const toastConfig = {
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#fff",
        borderLeftColor: "red",
        zIndex: 9999,
        elevation: 9999,
        position: "absolute", // helps with layering
        top: 120,
      }}
      text1Style={{ color: "black", fontWeight: "bold" }}
      text2Style={{ color: "black" }}
    />
  ),
};
export default function RootLayout() {
  const apiKey = "fvct7vwrd7ps";
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_300Light,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
    getSocket();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  LogBox.ignoreLogs(["CountryModal: Support for defaultProps will be removed"]);
  return (
    <>
      <PaperProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <JsStack
            screenOptions={{
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: ANIMATION_DURATION,
                    easing: Easing.out(Easing.ease),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: ANIMATION_DURATION,
                    easing: Easing.in(Easing.ease),
                  },
                },
              },
              cardOverlayEnabled: true,
              gestureEnabled: Platform.OS === "ios",
              cardStyleInterpolator: ({ current, next, layouts }) => {
                const rotate = current.progress.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: ROTATE_VALUES,
                  extrapolate: "clamp",
                });

                const INITIAL_SCALE = 1.6;
                const FINAL_SCALE = 1;

                const OVERLAY_OPACITY_MAX = 0.5;
                const NEXT_SCREEN_OPACITY_MIN = 0.8;

                const overlayOpacity = current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, OVERLAY_OPACITY_MAX],
                  extrapolate: "clamp",
                });

                const nextScreenOpacity = current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [NEXT_SCREEN_OPACITY_MIN, 1],
                  extrapolate: "clamp",
                });

                const scale = next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, FINAL_SCALE],
                      extrapolate: "clamp",
                    })
                  : current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [INITIAL_SCALE, 1],
                      extrapolate: "clamp",
                    });

                const INITIAL_TRANSLATE_X_MULTIPLIER = 1.6;
                const NEXT_TRANSLATE_X_MULTIPLIER = -0.3;

                const translateX = current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    INITIAL_TRANSLATE_X_MULTIPLIER * layouts.screen.width,
                    0,
                  ],
                  extrapolate: "clamp",
                });

                const nextTranslateX = next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        NEXT_TRANSLATE_X_MULTIPLIER * layouts.screen.width,
                      ],
                      extrapolate: "clamp",
                    })
                  : 0;

                const transform = [
                  { translateX },
                  { translateX: nextTranslateX },
                  { perspective: 1000 },
                  { rotateY: rotate },
                  { scale },
                ];

                return {
                  cardStyle: {
                    transform,
                    opacity: nextScreenOpacity,
                  },
                  overlayStyle: { opacity: overlayOpacity },
                };
              },
            }}
          >
            <IncomingCallListener />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen
              name="successfulRegistration"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="hospitalOptions"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="creditMe" options={{ headerShown: false }} />
            <Stack.Screen
              name="notification"
              options={{ headerShown: false }}
            />

            <Stack.Screen name="callDoctor" options={{ headerShown: false }} />
            <Stack.Screen
              name="availableConsultant"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="realEstate" options={{ headerShown: false }} />
            <Stack.Screen name="states" options={{ headerShown: false }} />
            <Stack.Screen name="selectPlot" options={{ headerShown: false }} />
            <Stack.Screen
              name="selectEstate"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="estateFeatures"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="healthIssue" options={{ headerShown: false }} />
            <Stack.Screen
              name="pay4Consultation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="emergencyDetails"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="emergencyMenu"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen
              name="resetPassword"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="forgotPassword"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen
              name="passwordResetOTP"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="clientSignup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="clientWallet"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="collectLoan"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="addDrug"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="addTest"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="drugs"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="tests"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="emergencyServices"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="pharmServices"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="medlabServices"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="consult"
              options={{
                headerShown: true,
                headerBackTitle: "",
                headerTitleAlign: "left",
                headerShadowVisible: false,
                headerTitle: "Consult",
              }}
            />
            <Stack.Screen
              name="walletHistory"
              options={{
                headerShown: true,
                headerBackTitle: "",
                headerTitleAlign: "left",
                headerShadowVisible: false,
                headerTitle: "History",
              }}
            />
            <Stack.Screen
              name="doctorSignup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="medLabSignup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="pharmacySignup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="emergencySignup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="selectProfile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="selectConsultant"
              options={{ headerShown: false }}
            />
            <StatusBar style="auto" />
          </JsStack>
        </View>
      </PaperProvider>
      <Toast config={toastConfig} />
    </>
  );
}
