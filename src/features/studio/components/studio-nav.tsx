"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, MessageSquare, Plus } from "lucide-react";

import { assistants, getAssistant } from "@/config/assistants";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { cn } from "@/lib/utils";
import type { StudioUser } from "@/types/user";
import type { ConversationSummary } from "@/types/conversation";
import { UserMenu } from "./user-menu";

const mainNav = [
  { label: "Library", href: "/studio", icon: LayoutGrid },
  { label: "Documents", href: "/studio/documents", icon: FileText },
];

export function StudioNav({
  onNavigate,
  user,
  conversations,
}: {
  onNavigate?: () => void;
  user: StudioUser;
  conversations: ConversationSummary[];
}) {
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

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length > 0 && (
          <>
            <SectionLabel>Recent</SectionLabel>
            <div className="space-y-0.5">
              {conversations.map((conversation) => {
                const href = `/studio/c/${conversation.id}`;
                const Icon = getAssistant(conversation.assistantId)?.icon ?? MessageSquare;
                return (
                  <Link
                    key={conversation.id}
                    href={href}
                    onClick={onNavigate}
                    className={itemClass(pathname === href)}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{conversation.title}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <SectionLabel>Assistants</SectionLabel>
        <div className="space-y-0.5">
          {assistants.map((assistant) => {
            const href = `/studio/chat/${assistant.id}`;
            const Icon = assistant.icon;
            return (
              <Hint
                key={assistant.id}
                side="right"
                align="center"
                content={
                  <div className="max-w-[220px]">
                    <p className="font-medium">{assistant.name}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed opacity-80">
                      {assistant.description}
                    </p>
                  </div>
                }
              >
                <Link href={href} onClick={onNavigate} className={itemClass(pathname === href)}>
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{assistant.name}</span>
                </Link>
              </Hint>
            );
          })}
        </div>
      </div>

      <div className="border-border border-t p-3">
        <UserMenu user={user} />
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground px-2 pt-4 pb-2 text-xs font-medium tracking-wider uppercase">
      {children}
    </p>
  );
}
