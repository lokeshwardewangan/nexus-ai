"use client";

import { useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowDown, ArrowUp, Check, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Markdown } from "@/features/chat/components/markdown";
import { useAutoScroll } from "@/features/chat/use-auto-scroll";
import type { DocumentSummary } from "@/types/document";

const STARTERS = [
  "Summarize these documents",
  "What are the key points?",
  "What does it say about pricing?",
];

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

export function DocsChatView({ documents }: { documents: DocumentSummary[] }) {
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/documents/chat" }));
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const { containerRef, handleScroll, scrollToBottom, showJumpButton } = useAutoScroll(messages);

  const isStreaming = status === "streaming" || status === "submitted";
  const includedIds = documents.filter((doc) => !excluded.has(doc.id)).map((doc) => doc.id);
  const allIncluded = excluded.size === 0;
  const hasDocuments = documents.length > 0;
  const canSend = hasDocuments && includedIds.length > 0;

  function toggle(id: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit(text: string) {
    const value = text.trim();
    if (!value || isStreaming || !canSend) return;
    sendMessage({ text: value }, { body: { documentIds: allIncluded ? undefined : includedIds } });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-border flex items-center gap-3 border-b px-5 py-3">
        <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-lg text-white">
          <FileText className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">Chat with your documents</h1>
          <p className="text-muted-foreground truncate text-xs">Answers cite the source file</p>
        </div>
        <Button asChild variant="outline" size="sm" className="ml-auto">
          <Link href="/studio/documents">
            <Upload className="size-4" />
            Manage
          </Link>
        </Button>
      </header>

      {/* Scope selector — which documents the answers come from */}
      {hasDocuments && (
        <div className="border-border bg-card/30 border-b px-5 py-3">
          <p className="text-xs">
            <span className="text-foreground font-medium">Documents in this chat</span>
            <span className="text-muted-foreground"> — tap a file to include or exclude it</span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {documents.map((doc) => {
              const included = !excluded.has(doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggle(doc.id)}
                  aria-pressed={included}
                  title={doc.name}
                  className={cn(
                    "inline-flex max-w-[220px] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                    included
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground opacity-70 hover:opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
                      included
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {included && <Check className="size-3" />}
                  </span>
                  <FileText className="size-3.5 shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} onScroll={handleScroll} className="h-full overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {!hasDocuments ? (
              <NoDocuments />
            ) : messages.length === 0 ? (
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
              </div>
            )}
          </div>
        </div>
        {showJumpButton && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to latest"
            className="border-border bg-card text-foreground hover:bg-accent absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border shadow-md transition-colors"
          >
            <ArrowDown className="size-4" />
          </button>
        )}
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
              disabled={!canSend}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder={
                hasDocuments ? "Ask about your documents…" : "Upload a document to get started"
              }
              className="max-h-40 min-h-0 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming || !canSend}
              className="size-9 shrink-0 rounded-xl"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs">
            {!hasDocuments
              ? "Upload a document on the Documents page to start."
              : includedIds.length === 0
                ? "Select at least one document to search."
                : `Asking across ${includedIds.length} of ${documents.length} document${documents.length > 1 ? "s" : ""} — answers cite the source.`}
          </p>
        </form>
      </div>
    </div>
  );
}

function NoDocuments() {
  return (
    <div className="flex flex-col items-center pt-10 text-center">
      <span className="bg-secondary flex size-14 items-center justify-center rounded-2xl">
        <FileText className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">No documents yet</h2>
      <p className="text-muted-foreground mt-1.5 max-w-md text-sm">
        Upload a file first, then come back here to ask questions about it.
      </p>
      <Button asChild className="mt-6">
        <Link href="/studio/documents">
          <Upload className="size-4" />
          Upload documents
        </Link>
      </Button>
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
        Answers come from the documents selected above, and cite the file they came from.
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
