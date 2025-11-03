import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import Portfolio from "./components/Portfolio";
import "./App.css";

type Topic = "career" | "funfacts";
type View = "portfolio" | "chat";

function App() {
  const [topic, setTopic] = useState<Topic>("career");
  const [view, setView] = useState<View>("portfolio");

  return (
    <div className="app">
      <div className="app-header">
        <h1>👋 Adam Tsityat - Professional Portfolio & CV Agent</h1>
        <p>Explore my portfolio or chat with my AI assistant!</p>
      </div>
      
      <div className="view-selector">
        <button
          className={`view-btn ${view === "portfolio" ? "active" : ""}`}
          onClick={() => setView("portfolio")}
        >
          📄 Portfolio
        </button>
        <button
          className={`view-btn ${view === "chat" ? "active" : ""}`}
          onClick={() => setView("chat")}
        >
          💬 Chat with AI
        </button>
      </div>

      {view === "chat" && (
        <div className="topic-selector">
          <button
            className={`topic-btn ${topic === "career" ? "active" : ""}`}
            onClick={() => setTopic("career")}
          >
            💼 Career
          </button>
          <button
            className={`topic-btn ${topic === "funfacts" ? "active" : ""}`}
            onClick={() => setTopic("funfacts")}
          >
            🎉 Fun Facts
          </button>
        </div>
      )}

      {view === "portfolio" ? <Portfolio /> : <ChatInterface topic={topic} />}
    </div>
  );
}

export default App;

