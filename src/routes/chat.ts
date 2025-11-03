import express from "express";
import { chatService } from "../services/chatService.js";

export const chatRouter = express.Router();

chatRouter.post("/", async (req, res) => {
  try {
    const { message, topic } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!topic || !["career", "funfacts"].includes(topic)) {
      return res.status(400).json({ error: "Topic must be 'career' or 'funfacts'" });
    }

    const response = await chatService.chat(message, topic);
    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

