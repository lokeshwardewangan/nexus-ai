interface SidebarProps {
  onNewChat: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
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
