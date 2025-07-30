import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    // forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };
  try {
    const socket = io(import.meta.env.VITE_BACKEND_URL, options);
    return socket;
  } catch (error) {
    throw error;
  }
};
