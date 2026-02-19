interface ChatHeaderProps {
  isStreaming: boolean;
}

export function ChatHeader({ isStreaming }: ChatHeaderProps) {
  return (
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
            boxShadow: isStreaming ? "0 0 8px oklch(0.75 0.18 80)" : "0 0 8px oklch(0.65 0.18 145)",
          }}
        />
        <span className="text-xs" style={{ color: "oklch(0.60 0.04 260)" }}>
          {isStreaming ? "Thinking…" : "Online"}
        </span>
      </div>
    </header>
  );
}
