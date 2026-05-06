import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "https://piolife-be.onrender.com";
let socket: Socket;

export const connectSocket = (userId: string) => {
  socket = io(SOCKET_SERVER_URL, {
    query: { userId },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnect");
  });

  socket.on("userStatusChanged", ({ userId, isOnline }) => {
    console.log(`🔄 User ${userId} is now ${isOnline ? "online" : "offline"}`);
  });

  return socket;
};

export const getSocket = () => socket;
