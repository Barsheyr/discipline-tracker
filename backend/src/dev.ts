import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import daysRouter from "./routes/days.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/days", daysRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Local server: http://localhost:${PORT}`);
});
