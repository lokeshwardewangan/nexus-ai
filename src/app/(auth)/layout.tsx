import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { assistants } from "@/config/assistants";

const highlights = [
  `${assistants.length} specialized assistants, one workspace`,
  "Chat with your own documents — cited answers",
  "Powered by Gemini, GPT, and Claude",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="bg-brand-gradient relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative text-white">
          <Logo href="/" />
        </div>

        <div className="relative max-w-sm">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Your entire AI toolkit, in one studio.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Nexus AI</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
