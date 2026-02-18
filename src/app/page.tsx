"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const userAvatar = "/user-avatar.png";
const botAvatar = "/bot-avatar.png";

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="animate-fade-slide-in flex items-end gap-3">
      {/* Bot Avatar */}
      <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-lg ring-2 shadow-indigo-500/10 ring-indigo-500/30">
        <Image
          width={36}
          height={36}
          src={botAvatar}
          sizes="36px"
          priority
          className="h-full w-full object-cover"
          alt="AI avatar"
        />
      </span>
      {/* Bubble */}
      <div
        className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
        style={{
          background: "oklch(0.16 0.035 265)",
          border: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-indigo-400" />
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-indigo-400" />
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-indigo-400" />
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ role, text, index }: { role: string; text: string; index: number }) {
  const isUser = role === "user";

  return (
    <div
      className={`animate-fade-slide-in flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Avatar */}
      <span
        className={`h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-lg ring-2 ${isUser ? "ring-indigo-500/50" : "ring-white/10"}`}
        style={{
          boxShadow: isUser ? "0 4px 16px rgba(99,102,241,0.35)" : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <Image
          width={36}
          height={36}
          src={isUser ? userAvatar : botAvatar}
          sizes="36px"
          priority
          className="h-full w-full object-cover"
          alt={isUser ? "You" : "AI"}
        />
      </span>

      {/* Bubble */}
      <div
        className={`max-w-[72%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? "rounded-2xl rounded-br-sm text-white" : "rounded-2xl rounded-bl-sm"
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.50 0.24 290))",
                boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
              }
            : {
                background: "oklch(0.16 0.035 265)",
                border: "1px solid oklch(1 0 0 / 8%)",
                color: "oklch(0.93 0.01 250)",
              }
        }
      >
        {text}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ onNewChat }: { onNewChat: () => void }) {
  const recentChats = [
    "What is the meaning of life?",
    "Explain quantum entanglement",
    "Write a poem about the sea",
  ];

  return (
    <aside
      className="hidden h-screen w-64 shrink-0 flex-col md:flex"
      style={{
        background: "oklch(0.12 0.028 265)",
        borderRight: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, oklch(0.60 0.22 264), oklch(0.55 0.24 290))",
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}
        >
          AI
        </div>
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: "oklch(0.93 0.01 250)" }}
        >
          AI Chat
        </span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4">
        <button
          onClick={onNewChat}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, oklch(0.60 0.22 264), oklch(0.55 0.24 290))",
            color: "white",
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 6px 24px rgba(99,102,241,0.5)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 16px rgba(99,102,241,0.3)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ height: "1px", background: "oklch(1 0 0 / 8%)" }} />

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-2 text-xs font-medium" style={{ color: "oklch(0.55 0.04 260)" }}>
          Recent
        </p>
        {recentChats.map((chat, i) => (
          <button
            key={i}
            className="mb-1 w-full cursor-pointer truncate rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-150"
            style={{ color: "oklch(0.70 0.04 260)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.18 0.04 265)";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.93 0.01 250)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.70 0.04 260)";
            }}
          >
            {chat}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
        <p className="text-xs" style={{ color: "oklch(0.45 0.04 260)" }}>
          Powered by Vercel AI SDK
        </p>
      </div>
    </aside>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { messages, sendMessage, status } = useChat();
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
        <header
          className="flex shrink-0 items-center justify-between px-6 py-4"
          style={{
            background: "oklch(0.12 0.028 265 / 80%)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: "oklch(0.93 0.01 250)" }}>
                AI Assistant
              </span>
              <span className="text-xs" style={{ color: "oklch(0.55 0.04 260)" }}>
                GPT-flash 2.5 lite · Always ready
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: isStreaming ? "oklch(0.75 0.18 80)" : "oklch(0.65 0.18 145)",
                boxShadow: isStreaming
                  ? "0 0 8px oklch(0.75 0.18 80)"
                  : "0 0 8px oklch(0.65 0.18 145)",
              }}
            />
            <span className="text-xs" style={{ color: "oklch(0.60 0.04 260)" }}>
              {isStreaming ? "Thinking…" : "Online"}
            </span>
          </div>
        </header>

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
                />
              );
            }),
          )}

          {/* Typing indicator */}
          {isStreaming && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          className="shrink-0 px-4 py-4 md:px-8"
          style={{
            background: "oklch(0.12 0.028 265 / 80%)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="mx-auto max-w-3xl">
            <div
              className="animate-pulse-glow overflow-hidden rounded-full"
              style={{ background: "oklch(0.16 0.035 265)" }}
            >
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
            <p className="mt-3 text-center text-xs" style={{ color: "oklch(0.40 0.03 260)" }}>
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
