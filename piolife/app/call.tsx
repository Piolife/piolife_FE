import React, { useEffect, useState } from "react";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamTheme,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { getExistingClient } from "@/components/streamClient";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/components/UserContext";
import { generateCallId } from "@/components/reusables";
import { CallControls } from "@stream-io/video-react-native-sdk";
import { API_URL } from "@/constants/api";

const CallScreen = () => {
  const [call, setCall] = useState<Call | null>(null);
  const { doctorId, type, specialtyId } = useLocalSearchParams<{
    doctorId: string;
    type: string;
    specialtyId: string;
  }>();

  const { user } = useUser();

  useEffect(() => {
    const init = async () => {
      const client = getExistingClient();
      if (!client) {
        console.error("Stream client not initialized yet!");
        return;
      }
      const docId = Array.isArray(doctorId) ? doctorId[0] : doctorId;
      const callId = await generateCallId(docId, user.id);
      console.log("New Call ID:", callId);

      const savedUser = await AsyncStorage.getItem("user");
      if (!savedUser) return;

      const userId = user.id;

      const activeCall = client.call("default", callId);

      await activeCall.getOrCreate({
        ring: true,
        video: type === "video",
        data: {
          members: [{ user_id: userId }, { user_id: doctorId }],
        },
      });

      try {
        await activeCall.join();
      } catch (error) {
        console.error("Failed to join call:", error);
      }

      setCall(activeCall);
    };

    init();
  }, []);

  useEffect(() => {
    if (!call) return;

    const handleParticipantJoined = async (event: any) => {
      const joinedUserId = event.participant.userId;

      // if it's the doctor that just joined, create consultation
      if (joinedUserId === doctorId) {
        try {
          await fetch(`${API_URL}/consultations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`, // jwt
            },
            body: JSON.stringify({
              practitionerId: doctorId,
              medicalIssueId: specialtyId, // pass from state or route
            }),
          });
          console.log("Consultation created");
        } catch (err) {
          console.error("Failed to create consultation", err);
        }
      }
    };

    call.on("participantJoined", handleParticipantJoined);

    return () => {
      call.off("participantJoined", handleParticipantJoined);
    };
  }, [call]);

  if (!call) return null;

  return (
    <StreamVideo client={getExistingClient()!}>
      <StreamCall call={call}>
        <StreamTheme>
          <CallContent
            CallControls={() => (
              <CallControls
                onHangupCallHandler={async () => {
                  await call?.leave();
                  router.back();
                }}
              />
            )}
          />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallScreen;
