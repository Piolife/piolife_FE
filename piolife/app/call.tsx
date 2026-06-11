// FIXED app/call.tsx — All bugs corrected:
// 1. Correct consultation endpoint /api/v12/sessions/consultations
// 2. Error state shown if client not ready
// 3. Loading state while connecting
// 4. After call ends → navigate to prescription form (doctor) or back (patient)
import React, { useEffect, useState } from "react";
import {
  Call, StreamCall, StreamTheme,
  CallContent, CallControls,
} from "@stream-io/video-react-native-sdk";
import { getExistingClient } from "@/components/streamClient";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/components/UserContext";
import { generateCallId } from "@/components/reusables";
import { API_URL } from "@/constants/api";
import { View, Text, ActivityIndicator, Pressable } from "react-native";

const CallScreen = () => {
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { doctorId, type, specialtyId, sessionId } = useLocalSearchParams<any>();
  const { user } = useUser();

  useEffect(() => {
    const init = async () => {
      try {
        const client = getExistingClient();
        if (!client) { setError("Call service not ready. Go back and try again."); return; }

        const docId = Array.isArray(doctorId) ? doctorId[0] : doctorId;
        if (!docId || !user?.id) { setError("Missing user or doctor information."); return; }

        const callId = await generateCallId(docId, user.id);
        const activeCall = client.call("default", callId);

        await activeCall.getOrCreate({
          ring: true,
          video: type === "video",
          data: { members: [{ user_id: user.id }, { user_id: docId }] },
        });
        await activeCall.join();
        setCall(activeCall);
      } catch (err: any) {
        setError(err?.message ?? "Failed to start call. Please try again.");
      }
    };
    init();
  }, []);

  // When doctor joins → create consultation record (FIXED endpoint)
  useEffect(() => {
    if (!call || !user?.token) return;
    const handleJoined = async (event: any) => {
      const joinedId = event.participant?.userId;
      const docId = Array.isArray(doctorId) ? doctorId[0] : doctorId;
      if (joinedId === docId) {
        try {
          await fetch(`${API_URL}/api/v12/sessions/consultations`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ practitionerId: docId, medicalIssueId: specialtyId }),
          });
        } catch { /* non-fatal */ }
      }
    };
    call.on("participantJoined", handleJoined);
    return () => call.off("participantJoined", handleJoined);
  }, [call]);

  const handleHangup = async () => {
    await call?.leave();
    // If user is a doctor, navigate to prescription form
    const userData = await AsyncStorage.getItem("user");
    const u = userData ? JSON.parse(userData) : null;
    if (u?.role === "medical_practitioner") {
      router.replace({
        pathname: "/prescriptionForm",
        params: { patientId: user?.id, sessionId, medicalIssueId: specialtyId },
      });
    } else {
      router.back();
    }
  };

  if (error) return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#fffff0" }}>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#272757", textAlign: "center", marginBottom: 16 }}>{error}</Text>
      <Pressable onPress={() => router.back()} style={{ backgroundColor: "#0E16FF", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fffff0" }}>Go Back</Text>
      </Pressable>
    </View>
  );

  if (!call) return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#272757" }}>
      <ActivityIndicator size="large" color="#fffff0" />
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,240,0.7)", marginTop: 16 }}>Connecting…</Text>
    </View>
  );

  // StreamVideo context is already provided by AppStack in _layout.tsx
  return (
    <StreamCall call={call}>
      <StreamTheme>
        <CallContent
          CallControls={() => (
            <CallControls onHangupCallHandler={handleHangup} />
          )}
        />
      </StreamTheme>
    </StreamCall>
  );
};

export default CallScreen;
