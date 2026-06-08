import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import router from "./routes/index";
import path from "path";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", router);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
