/** @format */
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  CallControls,
  User,
} from "@stream-io/video-react-native-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = "mmhfdzb5evj2";
const callId = "ehBhGiwxvfFb";

const CallScreen = () => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const init = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (!savedUser) return;

      const parsedUser = JSON.parse(savedUser);
      const userId = "Carnor_Jax";
      const userToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0Nhcm5vcl9KYXgiLCJ1c2VyX2lkIjoiQ2Fybm9yX0pheCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzQ3NzQ5MDA0LCJleHAiOjE3NDgzNTM4MDR9.hPs9jNUOArCA35b_eZCzacZsSbB9Hdm2iywkhAFyPg8";

      // User ID must match the ID embedded in the token
      const user: User = {
        id: userId,
        name: parsedUser.name,
        image: parsedUser.image,
      };

      const videoClient = new StreamVideoClient({
        apiKey,
        user,
        token: userToken,
      });
      const activeCall = videoClient.call("default", callId);

      await activeCall.join({ create: true });

      setClient(videoClient);
      setCall(activeCall);
    };

    init();

    return () => {
      client?.disconnectUser();
    };
  }, []);

  if (!client || !call) return null;

  return (
    <View className="flex-1 items-center justify-end pb-10">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <View className="w-full">
              <CallControls />
            </View>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </View>
  );
};

export default CallScreen;
