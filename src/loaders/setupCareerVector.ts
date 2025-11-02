import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";


console.log('sss');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupCareerVector() {
  const filePath = path.resolve(__dirname, "../../data/career.md");
  const content = fs.readFileSync(filePath, "utf-8");

  console.log("📄 Loaded career.md successfully.");

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
    collectionName: "adam_career",
    url: "http://localhost:8000", // make sure your ChromaDB Docker is running
  });

  console.log("✅ Career collection created and data embedded successfully.");
}

setupCareerVector().catch((err) => {
  console.error("❌ Error while setting up career collection:", err);
});