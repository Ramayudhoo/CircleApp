import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import router from "./routes/index";
import path from "path";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://divine-adaptation-production-26c5.up.railway.app",
    ],
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
