import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

