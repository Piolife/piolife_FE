import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import { JsStack } from "@/components/JsStack";
import { Easing } from "react-native-reanimated";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useCalls,
  RingingCallContent,
} from "@stream-io/video-react-native-sdk";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { PaperProvider } from "react-native-paper";
import { getSocket } from "./weSocket";
import { useUser } from "@/components/UserContext";
const ROTATE_VALUES = ["60deg", "45deg", "30deg", "15deg", "0deg"];
const ANIMATION_DURATION = 400;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import Toast, { BaseToastProps } from "react-native-toast-message";
import React from "react";
import { Text } from "react-native";
import { useStreamProvider } from "@/components/reusables";
import { getStreamClient } from "@/components/streamClient";
import { UserProvider } from "@/components/UserContext";
import { Feather } from "@expo/vector-icons";

type ToastVariant = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  bar: string;
};

const VARIANTS: Record<string, ToastVariant> = {
  error:   { icon: "x-circle",     iconColor: "#DC2626", iconBg: "#FEE2E2", bar: "#DC2626" },
  success: { icon: "check-circle", iconColor: "#16A34A", iconBg: "#DCFCE7", bar: "#16A34A" },
  info:    { icon: "info",         iconColor: "#0E16FF", iconBg: "#EEF0FF", bar: "#0E16FF" },
  warning: { icon: "alert-triangle", iconColor: "#D97706", iconBg: "#FEF3C7", bar: "#D97706" },
};

const AppToast = ({ type, text1, text2 }: BaseToastProps & { type?: string }) => {
  const v = VARIANTS[type ?? "info"] ?? VARIANTS.info;
  return (
    <View
      style={{
        marginHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* Left accent bar */}
      <View style={{ width: 4, position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: v.bar, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />

      {/* Icon */}
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: v.iconBg, alignItems: "center", justifyContent: "center", marginLeft: 16 }}>
        <Feather name={v.icon} size={20} color={v.iconColor} />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        {text1 ? (
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: "#272757", lineHeight: 20 }} numberOfLines={2}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#6B7280", marginTop: 2, lineHeight: 17 }} numberOfLines={2}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export const toastConfig = {
  error:   (props: BaseToastProps) => <AppToast {...props} type="error" />,
  success: (props: BaseToastProps) => <AppToast {...props} type="success" />,
  info:    (props: BaseToastProps) => <AppToast {...props} type="info" />,
  warning: (props: BaseToastProps) => <AppToast {...props} type="warning" />,
};
export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
      <Toast config={toastConfig} />
    </UserProvider>
  );
}
function RootLayoutContent() {
  const { user } = useUser();
  const apiKey = "fvct7vwrd7ps";
  const [appIsReady, setAppIsReady] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userToken, setUserToken] = useState<string>("");
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user) {
      setUserId(user.id);
      setUserToken(user.streamToken);
    }
  }, [user]);
  useStreamProvider(userId ?? "", userToken ?? "");
  useEffect(() => {
    if (!userId || !userToken) return; // ✅ wait until both exist

    const user: User = { id: userId };

    const videoClient = getStreamClient(apiKey, userToken, user);

    setClient(videoClient);
  }, [userId, userToken]);
  console.log("user", user);

  console.log("userId", userId);
  console.log("userToken", userToken);
  const RingingCalls = () => {
    const calls = useCalls().filter((c) => c.ringing);

    const ringingCall = calls[0];
    if (!ringingCall) return null;
    if (ringingCall) {
    }
    return (
      <StreamCall call={ringingCall}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <RingingCallContent />
        </SafeAreaView>
      </StreamCall>
    );
  };
  useFonts({
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
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    getSocket();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  LogBox.ignoreLogs(["CountryModal: Support for defaultProps will be removed"]);
  // if (!client) {
  //   return <ActivityIndicator size="large" color="#007AFF" />; // or splash/loading indicator
  // }
  const AuthStack = () => (
    <JsStack
      screenOptions={{
        headerShown: false,

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
      <JsStack.Screen name="login" options={{ header: () => null }} />

      <JsStack.Screen
        name="successfulRegistration"
        options={{ headerShown: false }}
      />
      <JsStack.Screen name="resetPassword" options={{ headerShown: false }} />
      <JsStack.Screen name="forgotPassword" options={{ headerShown: false }} />
      <JsStack.Screen name="otp" options={{ headerShown: false }} />
      <JsStack.Screen
        name="passwordResetOTP"
        options={{ headerShown: false }}
      />
      <JsStack.Screen name="clientSignup" options={{ headerShown: false }} />
      <JsStack.Screen name="doctorSignup" options={{ headerShown: false }} />
      <JsStack.Screen name="medLabSignup" options={{ headerShown: false }} />
      <JsStack.Screen name="pharmacySignup" options={{ headerShown: false }} />
      <JsStack.Screen name="emergencySignup" options={{ headerShown: false }} />
    </JsStack>
  );

  const AppStack = ({ client }: { client: StreamVideoClient }) => (
    <StreamVideo client={client}>
      <>
        <PaperProvider>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <JsStack
              screenOptions={{
                headerShown: false,
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
              <RingingCalls />

              <JsStack.Screen name="(tabs)" options={{ headerShown: false }} />
              <JsStack.Screen name="index" options={{ headerShown: false }} />
              <JsStack.Screen name="welcome" options={{ headerShown: false }} />
              <JsStack.Screen
                name="successfulRegistration"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="hospitalOptions"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="creditMe"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="notification"
                options={{ headerShown: false }}
              />

              <JsStack.Screen
                name="callDoctor"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="availableConsultant"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="realEstate"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="healthIssue"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="pay4Consultation"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="emergencyDetails"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="emergencyMenu"
                options={{ headerShown: false }}
              />

              <JsStack.Screen
                name="clientWallet"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="collectLoan"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="piolandStates"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="piolandEstates"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="piolandPlots"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="piolandPayment"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="piolandTracker"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="piolandDashboard"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="call"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="incomingCall"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="prescriptionForm"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="doctorDashboard"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="vipSubscription"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="subscription"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="referral"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="appDataSubscription"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="pharmDrugs"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="addDrug"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="addTest"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="drugs"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="tests"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="emergencyServices"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="pharmServices"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="medlabServices"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="consult"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="medicalHistory"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="medicalHistoryDetail"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="walletHistory"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="recentConsultations"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="nearbyMedlab"
                options={{
                  headerShown: false,
                }}
              />

              <JsStack.Screen
                name="nearbyPharmacy"
                options={{
                  headerShown: false,
                }}
              />
              <JsStack.Screen
                name="medLabTests"
                options={{
                  headerShown: true,
                  headerBackTitle: "",
                  headerTitleAlign: "left",
                  headerShadowVisible: false,
                  headerTitle: "Available Test Listing",
                }}
              />

              <JsStack.Screen
                name="selectProfile"
                options={{ headerShown: false }}
              />
              <JsStack.Screen
                name="selectConsultant"
                options={{ headerShown: false }}
              />
              <StatusBar style="auto" />
            </JsStack>
          </View>
        </PaperProvider>
      </>
    </StreamVideo>
  );
  return !client ? <AuthStack /> : <AppStack client={client} />;
}
