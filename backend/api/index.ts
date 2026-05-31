import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import daysRouter from "../src/routes/days";
import { connectDB } from "../src/lib/db";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/days", daysRouter);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

// ⭐ SERVERLESS HANDLER — no app.listen()
export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
