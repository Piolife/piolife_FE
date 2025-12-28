import { useEffect } from "react";
import { useCalls, CallingState } from "@stream-io/video-react-native-sdk";

const IncomingCallListener = () => {
  const calls = useCalls();

  const incomingCall = calls.find(
    (call) => call.state.callingState === CallingState.RINGING
  );

  useEffect(() => {
    if (incomingCall) {
      console.log("📞 Incoming call detected:", incomingCall.id);
    }
  }, [incomingCall]);

  return null;
};

export default IncomingCallListener;
