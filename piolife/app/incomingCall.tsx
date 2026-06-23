/**
 * app/incomingCall.tsx  — NEW SCREEN
 *
 * Shown when a doctor (or any provider) receives a ringing call from a patient.
 * Lets them Accept (audio or video) or Decline.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  useCalls,
  CallingState,
  StreamCall,
  StreamTheme,
  CallContent,
  CallControls,
} from "@stream-io/video-react-native-sdk";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const IncomingCallScreen = () => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const calls = useCalls();
  const [activeCall, setActiveCall] = useState<any>(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incomingCall = calls.find((c) => c.id === callId);

  const handleAccept = async () => {
    if (!incomingCall) return;
    setJoining(true);
    try {
      await incomingCall.accept();
      await incomingCall.join();
      setActiveCall(incomingCall);
    } catch (err: any) {
      setError(err?.message ?? "Failed to join call");
      setJoining(false);
    }
  };

  const handleDecline = async () => {
    try {
      await incomingCall?.leave({ reject: true });
    } finally {
      router.back();
    }
  };

  // If call was cancelled before answer
  useEffect(() => {
    if (!incomingCall && !activeCall) {
      router.back();
    }
  }, [incomingCall]);

  if (activeCall) {
    return (
      <StreamCall call={activeCall}>
        <StreamTheme>
          <CallContent
            CallControls={() => (
              <CallControls
                onHangupCallHandler={async () => {
                  await activeCall.leave();
                  router.replace("/doctorDashboard");
                }}
              />
            )}
          />
        </StreamTheme>
      </StreamCall>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffff0"
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
            color: "#D92D20",
            marginBottom: 16,
          }}
        >
          {error}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: "#0E16FF",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fffff0", fontFamily: "Inter_600SemiBold" }}>
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#272757"
        }}
    >
      <StatusBar style="light" backgroundColor="#272757" />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          paddingHorizontal: 32,
        }}
      >
        {/* Caller info */}
        <View style={{ alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#0E16FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="user" size={48} color="#fffff0" />
          </View>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#fffff0",
            }}
          >
            Incoming Consultation
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: "rgba(255,255,240,0.65)",
              textAlign: "center",
            }}
          >
            A patient is requesting to speak with you
          </Text>
        </View>

        {/* Pulsing ring animation hint */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 2,
              borderColor: "rgba(255,255,240,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                borderWidth: 2,
                borderColor: "rgba(255,255,240,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(14,22,255,0.4)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="phone-incoming" size={36} color="#fffff0" />
              </View>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: 40 }}>
          {/* Decline */}
          <Pressable
            onPress={handleDecline}
            style={({ pressed }) => ({
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#D92D20",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
              shadowColor: "#D92D20",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Feather name="phone-off" size={30} color="#fff" />
          </Pressable>

          {/* Accept */}
          <Pressable
            onPress={handleAccept}
            disabled={joining}
            style={({ pressed }) => ({
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#16A34A",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
              shadowColor: "#16A34A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            {joining ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="phone" size={30} color="#fff" />
            )}
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 32 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,240,0.5)",
            }}
          >
            Decline
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,240,0.5)",
            }}
          >
            Accept
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IncomingCallScreen;
