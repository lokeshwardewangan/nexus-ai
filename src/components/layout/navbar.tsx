import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { label: "Assistants", href: "#assistants" },
  { label: "Documents", href: "#documents" },
  { label: "How it works", href: "#how-it-works" },
];

export function Navbar() {
  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="text-muted-foreground hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/studio">Open studio</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
