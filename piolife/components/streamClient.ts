// streamClient.ts
import { StreamVideoClient, User } from "@stream-io/video-react-native-sdk";

let client: StreamVideoClient | null = null;

export const getStreamClient = (
  apiKey: string,

  token: string,
  user: User
): StreamVideoClient => {
  client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    token,
    user,
  });
  return client;
};

export const getExistingClient = (): StreamVideoClient | null => client;
