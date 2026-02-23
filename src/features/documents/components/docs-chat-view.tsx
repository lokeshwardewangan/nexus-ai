"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/features/chat/components/markdown";

const STARTERS = [
  "Summarize my documents",
  "What are the key points?",
  "What does it say about pricing?",
];

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

export function DocsChatView() {
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/documents/chat" }));
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || isStreaming) return;
    sendMessage({ text: value });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-border flex items-center gap-3 border-b px-5 py-3">
        <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-lg text-white">
          <FileText className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">Chat with your documents</h1>
          <p className="text-muted-foreground truncate text-xs">
            Answers cited to your uploaded files
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="ml-auto">
          <Link href="/studio/documents">
            <Upload className="size-4" />
            Manage
          </Link>
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState onPick={submit} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} />
              ))}
              {isStreaming && messages.at(-1)?.role === "user" && <Thinking />}
              {error && (
                <p
                  role="alert"
                  className="border-destructive/40 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-center text-sm"
                >
                  Something went wrong. Please try again.
                </p>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-border border-t px-4 py-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
          className="mx-auto max-w-3xl"
        >
          <div className="border-border focus-within:border-primary/50 bg-card flex items-end gap-2 rounded-2xl border p-2 transition-colors">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Ask about your documents…"
              className="max-h-40 min-h-0 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="size-9 shrink-0 rounded-xl"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Answers are grounded in your uploaded documents.
          </p>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-10 text-center">
      <span className="bg-brand-gradient flex size-14 items-center justify-center rounded-2xl text-white">
        <FileText className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">Ask your documents anything</h2>
      <p className="text-muted-foreground mt-1.5 max-w-md text-sm">
        Questions are answered from the files you&apos;ve uploaded, with citations to the source.
      </p>

      <div className="mt-8 grid w-full max-w-lg gap-2.5 sm:grid-cols-3">
        {STARTERS.map((starter) => (
          <button
            key={starter}
            onClick={() => onPick(starter)}
            className="border-border hover:border-primary/40 hover:bg-card rounded-xl border px-4 py-3 text-left text-sm transition-colors"
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const text = messageText(message);

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="bg-secondary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <Markdown>{text}</Markdown>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <span className="bg-secondary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <FileText className="size-4" />
      </span>
      <div className="flex items-center gap-1 pt-2.5">
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
      </div>
    </div>
  );
}
