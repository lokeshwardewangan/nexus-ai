"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, Plus } from "lucide-react";

import { assistants } from "@/config/assistants";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

const mainNav = [
  { label: "Library", href: "/studio", icon: LayoutGrid },
  { label: "Documents", href: "/studio/documents", icon: FileText },
];

export function StudioNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const itemClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-secondary text-foreground font-medium"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
    );

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-4">
        <Logo />
      </div>

      <div className="px-3 pb-2">
        <Button asChild className="w-full justify-start">
          <Link href="/studio" onClick={onNavigate}>
            <Plus className="size-4" />
            New chat
          </Link>
        </Button>
      </div>

      <nav className="space-y-0.5 px-3 pt-2">
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={itemClass(pathname === item.href)}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="text-muted-foreground px-5 pt-5 pb-2 text-xs font-medium tracking-wider uppercase">
        Assistants
      </p>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {assistants.map((assistant) => {
          const href = `/studio/chat/${assistant.id}`;
          const Icon = assistant.icon;
          return (
            <Link
              key={assistant.id}
              href={href}
              onClick={onNavigate}
              className={itemClass(pathname === href)}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{assistant.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-border border-t p-3">
        <UserMenu />
      </div>
    </div>
  );
}
