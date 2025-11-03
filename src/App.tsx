import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import "./App.css";

type Topic = "career" | "funfacts";

function App() {
  const [topic, setTopic] = useState<Topic>("career");

  return (
    <div className="app">
      <div className="app-header">
        <h1>👋 Chat with Adam's CV Agent</h1>
        <p>Ask me anything about my career or fun facts!</p>
      </div>
      
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

      <ChatInterface topic={topic} />
    </div>
  );
}

export default App;

