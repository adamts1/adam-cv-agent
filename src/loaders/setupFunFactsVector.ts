import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupFunFactsVector() {
  const filePath = path.resolve(__dirname, "../../data/funfacts.md");
  const content = fs.readFileSync(filePath, "utf-8");

  console.log("📄 Loaded funfacts.md successfully.");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.createDocuments([content]);

  console.log(`✂️ Split into ${docs.length} chunks.`);

  const embeddings = new OpenAIEmbeddings(
    process.env.OPENAI_API_KEY ? { apiKey: process.env.OPENAI_API_KEY } : {}
  );

  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "adam_funfacts",
    url: "http://localhost:8000", // same chroma instance
  });

  console.log("✅ Fun facts collection created and data embedded successfully.");
}

setupFunFactsVector().catch((err) => {
  console.error("❌ Error while setting up fun facts collection:", err);
});