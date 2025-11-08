import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

async function testPineconeConnection() {
  console.log("🧪 Testing Pinecone Connection\n");
  console.log("=".repeat(60));

  // Step 1: Check environment variables
  console.log("\n1️⃣ Checking environment variables...");
  const checks = {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    PINECONE_API_KEY: !!process.env.PINECONE_API_KEY,
    PINECONE_INDEX: !!process.env.PINECONE_INDEX,
  };

  for (const [key, value] of Object.entries(checks)) {
    if (value) {
      console.log(`   ✅ ${key} is set`);
      if (key !== "PINECONE_INDEX") {
        console.log(`      Value: ${process.env[key]?.substring(0, 15)}...`);
      } else {
        console.log(`      Value: ${process.env[key]}`);
      }
    } else {
      console.log(`   ❌ ${key} is NOT set`);
      console.log(`\n⚠️  Please set ${key} in your .env file\n`);
      return;
    }
  }

  try {
    // Step 2: Test Pinecone connection
    console.log("\n2️⃣ Testing Pinecone connection...");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log("   ✅ Pinecone client initialized");

    // Step 3: Get index
    console.log("\n3️⃣ Connecting to index...");
    const indexName = process.env.PINECONE_INDEX!;
    const pineconeIndex = pinecone.Index(indexName);
    console.log(`   ✅ Connected to index: ${indexName}`);

    // Step 4: Get index stats
    console.log("\n4️⃣ Fetching index statistics...");
    const stats = await pineconeIndex.describeIndexStats();
    console.log(`   ✅ Index stats retrieved successfully`);
    console.log(`   📊 Statistics:`);
    console.log(`      - Total vector count: ${stats.totalRecordCount || 0}`);
    console.log(`      - Dimension: ${stats.dimension || "N/A"}`);
    console.log(`      - Index fullness: ${stats.indexFullness || 0}`);
    
    if (stats.namespaces && Object.keys(stats.namespaces).length > 0) {
      console.log(`      - Namespaces:`);
      for (const [ns, nsStats] of Object.entries(stats.namespaces)) {
        console.log(`        * ${ns}: ${nsStats.recordCount || 0} vectors`);
      }
    } else {
      console.log(`      - Namespaces: None (index is empty)`);
    }

    // Step 5: Test OpenAI embeddings
    console.log("\n5️⃣ Testing OpenAI embeddings...");
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY!,
    });
    const testEmbedding = await embeddings.embedQuery("Hello, this is a test");
    console.log(`   ✅ OpenAI embeddings working`);
    console.log(`   📐 Embedding dimensions: ${testEmbedding.length}`);
    
    // Check if dimensions match
    if (stats.dimension && stats.dimension !== testEmbedding.length) {
      console.log(`   ⚠️  WARNING: Dimension mismatch!`);
      console.log(`      Index expects: ${stats.dimension}`);
      console.log(`      OpenAI returns: ${testEmbedding.length}`);
      console.log(`      You may need to recreate your Pinecone index with dimension=${testEmbedding.length}`);
    } else if (stats.dimension) {
      console.log(`   ✅ Dimensions match (${testEmbedding.length})`);
    }

    // Step 6: List indexes
    console.log("\n6️⃣ Listing all available indexes...");
    const indexes = await pinecone.listIndexes();
    console.log(`   Available indexes:`);
    if (indexes && indexes.indexes && indexes.indexes.length > 0) {
      for (const idx of indexes.indexes) {
        const marker = idx.name === indexName ? "👉" : "  ";
        console.log(`   ${marker} ${idx.name}`);
        if (idx.name === indexName) {
          console.log(`      - Status: ${idx.status?.ready ? "✅ Ready" : "⏳ Not ready"}`);
          console.log(`      - Dimension: ${idx.dimension}`);
          console.log(`      - Metric: ${idx.metric}`);
        }
      }
    } else {
      console.log(`   ❌ No indexes found`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ All connection tests passed!");
    console.log("\n💡 Next steps:");
    console.log("   1. If your index shows 0 vectors, run:");
    console.log("      npm run setup:all");
    console.log("   2. Check that your index dimension is 1536");
    console.log("   3. Make sure your index is in 'Ready' state");

  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.error("\n❌ Error occurred during testing:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      console.error(`\n   Stack trace:`);
      console.error(error.stack);
    } else {
      console.error(`   ${error}`);
    }
    
    console.log("\n💡 Common issues:");
    console.log("   1. Invalid API key - check your .env file");
    console.log("   2. Index doesn't exist - create it in Pinecone console");
    console.log("   3. Wrong index name - verify PINECONE_INDEX in .env");
    console.log("   4. Network issues - check your internet connection");
  }
}

testPineconeConnection().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

