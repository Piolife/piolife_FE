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
  CallContent,
} from "@stream-io/video-react-native-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = "fvct7vwrd7ps";
const callId = "default_4b0fce27-f468-44de-b5d2-0402710d5adc111";
// const callId = "ertyuikjyyy";

const CallScreen = () => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (!savedUser) return;

      const parsedUser = JSON.parse(savedUser);
      const userId = parsedUser.id;
      const userToken = parsedUser.streamToken;

      // User ID must match the ID embedded in the token
      const user: User = {
        id: userId,
      };

      const videoClient = StreamVideoClient.getOrCreateInstance({
        apiKey,
        user,
        token: userToken,
      });
      const activeCall = videoClient.call("default", callId);

      try {
        await activeCall.join({ create: true });
      } catch (error) {
        console.error("Failed to join call:", error);
      }
      // const activeCall = await videoClient.call("default", callId).getOrCreate({
      //   ring: true,
      //   video: true,
      //   data: {
      //     members: [
      //       { user_id: userId }, // yourself
      //       { user_id: userId }, // replace with actual friend's user_id
      //     ],
      //   },
      // });

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
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <CallContent />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallScreen;
