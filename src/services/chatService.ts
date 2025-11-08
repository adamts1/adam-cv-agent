import "dotenv/config";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

class ChatService {
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;
  private pinecone: Pinecone;

  constructor() {
    this.embeddings = new OpenAIEmbeddings(
      process.env.OPENAI_API_KEY ? { 
        apiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
        dimensions: 1024, // Match Pinecone index dimension
      } : {
        modelName: "text-embedding-3-small",
        dimensions: 1024,
      }
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

    // Initialize Pinecone
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });
  }

  async chat(message: string, topic: "career" | "funfacts"): Promise<string> {
    const namespace = topic === "career" ? "adam_career" : "adam_funfacts";
    const topicName = topic === "career" ? "Adam's career, experience, and professional background" : "Adam's fun facts, personal interests, and personality";

    // Connect to Pinecone index
    const pineconeIndex = this.pinecone.Index(process.env.PINECONE_INDEX || "");

    const vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
      pineconeIndex,
      namespace,
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

