import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
