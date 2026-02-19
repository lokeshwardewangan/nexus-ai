import Image from "next/image";

interface MessageBubbleProps {
  role: string;
  text: string;
  index: number;
  userAvatar: string;
  botAvatar: string;
}

export function MessageBubble({ role, text, index, userAvatar, botAvatar }: MessageBubbleProps) {
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
