import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupFunFactsVector() {
  try {
    // Verify environment variables
    console.log("🔍 Checking environment variables...");
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("❌ OPENAI_API_KEY is not set in environment variables");
    }
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("❌ PINECONE_API_KEY is not set in environment variables");
    }
    if (!process.env.PINECONE_INDEX) {
      throw new Error("❌ PINECONE_INDEX is not set in environment variables");
    }
    console.log("✅ Environment variables verified");
    console.log(`   - Pinecone Index: ${process.env.PINECONE_INDEX}`);
    console.log(`   - OpenAI API Key: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);
    console.log(`   - Pinecone API Key: ${process.env.PINECONE_API_KEY.substring(0, 10)}...`);

    const filePath = path.resolve(__dirname, "../../data/funfacts.md");
    const content = fs.readFileSync(filePath, "utf-8");

    console.log(`\n📄 Loaded funfacts.md successfully (${content.length} characters).`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const docs = await splitter.createDocuments([content]);

    console.log(`✂️ Split into ${docs.length} chunks.`);
    if (docs.length > 0 && docs[0]?.pageContent) {
      console.log(`   First chunk preview: ${docs[0].pageContent.substring(0, 100)}...`);
    }

    console.log("\n🔗 Initializing OpenAI embeddings...");
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
      dimensions: 1024, // Match Pinecone index dimension
    });

    // Initialize Pinecone
    console.log("🔗 Connecting to Pinecone...");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    
    // Check index stats before upload
    console.log("📊 Checking Pinecone index stats before upload...");
    const statsBefore = await pineconeIndex.describeIndexStats();
    console.log(`   Current vector count: ${statsBefore.totalRecordCount || 0}`);
    console.log(`   Namespaces: ${JSON.stringify(statsBefore.namespaces || {})}`);

    // Create vector store and upload documents
    console.log("\n⬆️ Uploading documents to Pinecone (namespace: adam_funfacts)...");
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: "adam_funfacts",
    });

    // Check index stats after upload
    console.log("\n📊 Checking Pinecone index stats after upload...");
    const statsAfter = await pineconeIndex.describeIndexStats();
    console.log(`   Total vector count: ${statsAfter.totalRecordCount || 0}`);
    console.log(`   Namespaces: ${JSON.stringify(statsAfter.namespaces || {})}`);

    console.log("\n✅ Fun facts collection created and data embedded successfully in Pinecone!");
  } catch (error) {
    console.error("\n❌ Error details:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    } else {
      console.error(`   ${error}`);
    }
    throw error;
  }
}

setupFunFactsVector().catch((err) => {
  console.error("❌ Error while setting up fun facts collection:", err);
});