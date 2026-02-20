"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { ArrowUp, Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { getAssistant, type Assistant } from "@/config/assistants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "./markdown";

function modelLabel(model: string): string {
  if (model.startsWith("openai:")) return "GPT";
  if (model.startsWith("anthropic:")) return "Claude";
  return "Gemini";
}

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

export function ChatView({ assistantId }: { assistantId: string }) {
  const assistant = getAssistant(assistantId);
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (!assistant) return null;
  const Icon = assistant.icon;

  function submit(text: string) {
    const value = text.trim();
    if (!value || isStreaming) return;
    sendMessage({ text: value }, { body: { assistantId } });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-border flex items-center gap-3 border-b px-5 py-3">
        <span className="bg-secondary flex size-9 items-center justify-center rounded-lg">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{assistant.name}</h1>
          <p className="text-muted-foreground truncate text-xs">{assistant.tagline}</p>
        </div>
        <span className="text-muted-foreground border-border ml-auto hidden rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap sm:inline">
          {modelLabel(assistant.model)}
        </span>
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState assistant={assistant} onPick={submit} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} assistant={assistant} />
              ))}
              {isStreaming && messages.at(-1)?.role === "user" && (
                <Thinking assistant={assistant} />
              )}
              {error && (
                <p
                  role="alert"
                  className="border-destructive/40 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-center text-sm"
                >
                  Something went wrong reaching the assistant. Please try again.
                </p>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
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
              placeholder={`Message ${assistant.name}…`}
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
            Nexus can make mistakes. Check important information.
          </p>
        </form>
      </div>
    </div>
  );
}

function EmptyState({
  assistant,
  onPick,
}: {
  assistant: Assistant;
  onPick: (text: string) => void;
}) {
  const Icon = assistant.icon;
  return (
    <div className="flex flex-col items-center pt-10 text-center">
      <span className="bg-secondary flex size-14 items-center justify-center rounded-2xl">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{assistant.name}</h2>
      <p className="text-muted-foreground mt-1.5 max-w-md text-sm">{assistant.description}</p>

      <div className="mt-8 grid w-full max-w-lg gap-2.5 sm:grid-cols-2">
        {assistant.starters.map((starter) => (
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

function MessageRow({ message, assistant }: { message: UIMessage; assistant: Assistant }) {
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

  const Icon = assistant.icon;
  return (
    <div className="group flex gap-3">
      <span className="bg-secondary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm">
          <Markdown>{text}</Markdown>
        </div>
        {text && <CopyButton text={text} />}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="text-muted-foreground hover:text-foreground mt-2 inline-flex items-center gap-1.5 text-xs opacity-0 transition group-hover:opacity-100"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Thinking({ assistant }: { assistant: Assistant }) {
  const Icon = assistant.icon;
  return (
    <div className="flex gap-3">
      <span className="bg-secondary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4" />
      </span>
      <div className="flex items-center gap-1 pt-2.5">
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
        <span className="typing-dot bg-muted-foreground size-1.5 rounded-full" />
      </div>
    </div>
  );
}
