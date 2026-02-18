import Image from "next/image";

interface TypingIndicatorProps {
  botAvatar: string;
}

export function TypingIndicator({ botAvatar }: TypingIndicatorProps) {
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
