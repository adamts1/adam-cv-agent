# Pinecone Debugging Guide

This guide will help you troubleshoot issues with data not being stored in Pinecone.

## Quick Debug Steps

### 1. Run the Connection Test

First, test your Pinecone connection and configuration:

```bash
npm run test:pinecone
```

This will:
- ✅ Verify all environment variables are set
- ✅ Test connection to Pinecone
- ✅ Show your index statistics
- ✅ Display namespace information
- ✅ Verify OpenAI embeddings are working
- ✅ Check for dimension mismatches

### 2. Check Your Environment Variables

Make sure your `.env` file contains:

```
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=your-index-name
PORT=3001
```

**Common issues:**
- Missing `.env` file in project root
- Typos in variable names
- Extra spaces around values
- Wrong API keys or index name

### 3. Verify Your Pinecone Index

Go to [https://app.pinecone.io/](https://app.pinecone.io/) and check:

- ✅ Index exists with the correct name
- ✅ Index status is "Ready" (not "Initializing")
- ✅ Dimension is set to **1536** (for OpenAI embeddings)
- ✅ Metric is set to "cosine"
- ✅ Pod type is configured (Starter/Standard)

**If dimension is wrong:**
You'll need to delete and recreate the index with dimension=1536.

### 4. Upload Data with Enhanced Logging

Run the setup scripts with detailed logging:

```bash
# Upload career data
npm run setup:career

# Upload fun facts data
npm run setup:funfacts

# Or both at once
npm run setup:all
```

The scripts will now show:
- Environment variable verification
- File loading details
- Number of chunks created
- Before/after vector counts
- Namespace information
- Detailed error messages if something fails

## Common Issues and Solutions

### Issue 1: "PINECONE_API_KEY is not set"

**Solution:**
1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your Pinecone API key:
   ```
   PINECONE_API_KEY=pcsk_your_key_here
   ```
3. Restart your terminal/script

### Issue 2: "Index not found" or connection errors

**Solution:**
1. Check that the index name in `.env` matches exactly (case-sensitive)
2. Verify the index exists in Pinecone console
3. Make sure the index is in "Ready" state
4. Try refreshing your API key

### Issue 3: Dimension mismatch error

**Solution:**
1. OpenAI's text-embedding-ada-002 uses **1536 dimensions**
2. Your Pinecone index must be created with dimension=1536
3. If you created it with wrong dimensions, you need to:
   - Delete the old index
   - Create a new one with dimension=1536
   - Re-run the setup scripts

### Issue 4: Data uploads but shows 0 vectors

**Possible causes:**
1. Index is still initializing (wait a few minutes)
2. Wrong namespace being queried
3. Vectors were uploaded but then deleted
4. Index statistics need to refresh

**Solution:**
1. Wait 1-2 minutes after upload
2. Run `npm run test:pinecone` to check current stats
3. Check the Pinecone console for vector count
4. Verify namespaces are showing data

### Issue 5: Script runs but no errors, yet no data in Pinecone

**Solution:**
1. Check if the upload actually completed (look for success message)
2. Verify you're looking at the correct index in Pinecone console
3. Check if you have multiple Pinecone projects (wrong project selected?)
4. Try manually refreshing the Pinecone console
5. Check index statistics using the test script

## Step-by-Step Debugging Process

### Step 1: Test Connection
```bash
npm run test:pinecone
```
Look for any errors or warnings.

### Step 2: Check Index Configuration
1. Go to Pinecone console
2. Click on your index
3. Verify:
   - Dimension: 1536
   - Metric: cosine
   - Status: Ready

### Step 3: Try Uploading Data
```bash
npm run setup:career
```

Watch the console output carefully. You should see:
```
🔍 Checking environment variables...
✅ Environment variables verified
📄 Loaded career.md successfully (XXX characters).
✂️ Split into X chunks.
🔗 Initializing OpenAI embeddings...
🔗 Connecting to Pinecone...
📊 Checking Pinecone index stats before upload...
   Current vector count: 0
⬆️ Uploading documents to Pinecone...
📊 Checking Pinecone index stats after upload...
   Total vector count: X
✅ Career collection created and data embedded successfully in Pinecone!
```

### Step 4: Verify Data is There
```bash
npm run test:pinecone
```

Check the namespaces section - you should see:
```
- Namespaces:
  * adam_career: X vectors
  * adam_funfacts: Y vectors
```

### Step 5: Test the Chat Service
Start the app and try asking a question:
```bash
npm run dev
```

## Getting More Help

If you're still having issues:

1. **Check the logs** - Look for specific error messages
2. **Verify API quotas** - Make sure you haven't exceeded limits
3. **Check network** - Ensure you have internet access
4. **Try recreating index** - Sometimes a fresh start helps
5. **Check Pinecone status** - Visit Pinecone status page for outages

## Useful Commands

```bash
# Test Pinecone connection and show stats
npm run test:pinecone

# Upload career data with detailed logs
npm run setup:career

# Upload fun facts data with detailed logs
npm run setup:funfacts

# Upload all data
npm run setup:all

# Start the application
npm run dev

# View server logs only
npm run dev:server
```

## Environment File Template

Create a `.env` file in the project root with:

```env
# OpenAI API Key (starts with sk-)
OPENAI_API_KEY=sk-...

# Pinecone API Key (starts with pcsk_)
PINECONE_API_KEY=pcsk_...

# Pinecone Index Name (lowercase, no spaces)
PINECONE_INDEX=adam-cv-agent

# Server Port
PORT=3001
```

## Index Creation Settings (Pinecone Console)

When creating your index at [app.pinecone.io](https://app.pinecone.io/):

1. **Index Name**: `adam-cv-agent` (or your choice)
2. **Dimensions**: `1536` ⚠️ CRITICAL - Must be exactly 1536
3. **Metric**: `cosine`
4. **Pod Type**: `Starter` (free tier) or higher
5. **Replicas**: `1` (default)
6. **Pods**: `1` (default)

## Success Indicators

You know everything is working when:
- ✅ `npm run test:pinecone` shows vector count > 0
- ✅ Namespaces show `adam_career` and `adam_funfacts`
- ✅ Dimension matches (1536)
- ✅ Index status is "Ready"
- ✅ Setup scripts complete without errors
- ✅ Chat interface returns relevant answers

