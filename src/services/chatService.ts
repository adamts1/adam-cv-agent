import "dotenv/config";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

class ChatService {
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;

  constructor() {
    this.embeddings = new OpenAIEmbeddings(
      process.env.OPENAI_API_KEY ? { apiKey: process.env.OPENAI_API_KEY } : {}
    );

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }

    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      apiKey,
    });
  }

  async chat(message: string, topic: "career" | "funfacts"): Promise<string> {
    const collectionName = topic === "career" ? "adam_career" : "adam_funfacts";
    const topicName = topic === "career" ? "Adam's career, experience, and professional background" : "Adam's fun facts, personal interests, and personality";

    // Connect to ChromaDB collection
    const vectorStore = new Chroma(this.embeddings, {
      collectionName,
      url: "http://localhost:8000",
    });

    const retriever = vectorStore.asRetriever({ k: 4 });

    try {
      // Retrieve relevant documents
      const docs = await retriever.invoke(message);
      const context = docs.map((doc) => doc.pageContent).join("\n\n");

      // Create a custom prompt template
      const promptTemplate = PromptTemplate.fromTemplate(
        `You are a friendly AI assistant helping people learn about ${topicName}.

Use the following pieces of context to answer the question. If you don't know the answer based on the provided context, just say that you don't have that information available.

Context:
{context}

Question: {question}

Helpful Answer:`
      );

      // Create the chain
      const chain = promptTemplate
        .pipe(this.llm)
        .pipe(new StringOutputParser());

      const response = await chain.invoke({
        context,
        question: message,
      });
      return response || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  }
}

export const chatService = new ChatService();

