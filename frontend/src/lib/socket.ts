import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL_BASE || "http://localhost:3000",
  {
    autoConnect: true,
  },
);

export default socket;
