// FIXED components/IncomingCallHandler.tsx
// Bug: was detecting incoming calls but never navigating to accept/reject screen
// Fix: navigate to /incomingCall screen where doctor can accept or reject
import { useEffect } from "react";
import { useCalls, CallingState } from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";

const IncomingCallListener = () => {
  const calls = useCalls();
  const incomingCall = calls.find(
    (call) => call.state.callingState === CallingState.RINGING
  );

  useEffect(() => {
    if (incomingCall) {
      // Navigate to incoming call screen so doctor can answer or decline
      router.push({
        pathname: "/incomingCall",
        params: { callId: incomingCall.id },
      });
    }
  }, [incomingCall?.id]);

  return null;
};

export default IncomingCallListener;
