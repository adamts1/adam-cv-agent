# Adam CV Agent

A chat application that lets users ask questions about Adam's career and fun facts, powered by ChromaDB, LangChain, and OpenAI.

## Features

- 💼 Chat about career, experience, and professional background
- 🎉 Chat about fun facts and personality
- 🤖 Powered by OpenAI GPT with RAG (Retrieval Augmented Generation)
- 💾 Uses ChromaDB for vector storage
- ⚛️ Modern React frontend with Vite
- 🚀 Express backend API

## Prerequisites

- Node.js (v18 or higher)
- Docker (for ChromaDB)
- OpenAI API key

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

3. **Start ChromaDB (v2 API):**
   ```bash
   docker run -d \
     -p 8000:8000 \
     -v chroma-data:/chroma/chroma \
     --name chroma \
     chromadb/chroma:latest
   ```
   
   This uses the latest ChromaDB with v2 API support. The application is configured to use the modern host/port configuration for optimal compatibility.

4. **Set up vector databases:**
   ```bash
   # Set up career data
   npm run setup:career
   
   # Set up fun facts data
   npm run setup:funfacts
   
   # Or set up both at once
   npm run setup:all
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 3001) and frontend dev server (port 3000).

   Or run them separately:
   ```bash
   # Backend only
   npm run dev:server
   
   # Frontend only
   npm run dev:client
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:server` - Start backend server only
- `npm run dev:client` - Start frontend dev server only
- `npm run server` - Start backend server in production mode
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run setup:career` - Set up career vector database
- `npm run setup:funfacts` - Set up fun facts vector database
- `npm run setup:all` - Set up both vector databases

## Project Structure

```
adam-cv-agent/
├── src/
│   ├── components/        # React components
│   │   └── ChatInterface.tsx
│   ├── loaders/           # Vector database setup scripts
│   │   ├── setupCareerVector.ts
│   │   └── setupFunFactsVector.ts
│   ├── routes/            # Express routes
│   │   └── chat.ts
│   ├── services/          # Business logic
│   │   └── chatService.ts
│   ├── App.tsx            # Main React component
│   ├── main.tsx           # React entry point
│   └── server.ts          # Express server
├── data/                  # Source data files
│   ├── career.md
│   └── funfacts.md
├── index.html
├── vite.config.ts
└── package.json
```

## How It Works

1. **Vector Setup**: The loaders split the markdown files into chunks, generate embeddings using OpenAI, and store them in ChromaDB collections using v2 API.

2. **Chat Flow**:
   - User sends a message from the React frontend
   - Frontend makes a POST request to `/api/chat` with the message and topic
   - Backend uses LangChain to retrieve relevant context from ChromaDB (v2 API)
   - The context and user question are sent to OpenAI with a custom prompt
   - The AI-generated response is sent back to the frontend

3. **RAG (Retrieval Augmented Generation)**: The system uses semantic search to find relevant information from the vector database, then uses that context to generate accurate, informed responses.

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: Express.js with TypeScript
- **Vector Database**: ChromaDB (v2 API)
- **AI/ML**: LangChain with OpenAI GPT-4o-mini
- **Embeddings**: OpenAI text-embedding-ada-002

## License

ISC
