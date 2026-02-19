import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface ChatInputAreaProps {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatInputArea({ placeholders, onChange, onSubmit }: ChatInputAreaProps) {
  return (
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
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
        <p className="mt-3 text-center text-xs" style={{ color: "oklch(0.40 0.03 260)" }}>
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
