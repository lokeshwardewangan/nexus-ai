"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { TypingIndicator } from "@/features/chat/components/TypingIndicator";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { Sidebar } from "@/features/chat/components/Sidebar";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatInputArea } from "@/features/chat/components/ChatInputArea";

const userAvatar = "/user-avatar.png";
const botAvatar = "/bot-avatar.png";

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

export default function Home() {
  const { messages, sendMessage, error, status } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.10 0.025 265)" }}>
      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} />

      {/* Main Chat Area */}
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Header */}
        <ChatHeader isStreaming={isStreaming} />

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 md:px-8">
          {messages.length === 0 && (
            <div className="animate-fade-slide-in flex h-full flex-col items-center justify-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, oklch(0.60 0.22 264), oklch(0.55 0.24 290))",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
                }}
              >
                AI
              </div>
              <div className="text-center">
                <h2
                  className="mb-1 text-xl font-semibold"
                  style={{ color: "oklch(0.93 0.01 250)" }}
                >
                  How can I help you today?
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.55 0.04 260)" }}>
                  Ask me anything — I&apos;m here to assist.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, msgIndex) =>
            message.parts.map((part, partIndex) => {
              if (part.type !== "text") return null;
              return (
                <MessageBubble
                  key={`${message.id}-${partIndex}`}
                  role={message.role}
                  text={part.text}
                  index={msgIndex}
                  userAvatar={userAvatar}
                  botAvatar={botAvatar}
                />
              );
            }),
          )}

          {/* Typing indicator */}
          {isStreaming && messages[messages.length - 1]?.role === "user" && (
            <TypingIndicator botAvatar={botAvatar} />
          )}

          {/* Error state */}
          {error && (
            <div
              role="alert"
              className="border-destructive/40 bg-destructive/10 text-destructive mx-auto max-w-md rounded-xl border px-4 py-3 text-center text-sm"
            >
              Something went wrong while reaching the AI. Please try again.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInputArea placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
