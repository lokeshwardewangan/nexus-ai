"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { StudioUser } from "@/types/user";
import type { ConversationSummary } from "@/types/conversation";
import { StudioNav } from "./studio-nav";

export function StudioShell({
  children,
  user,
  conversations,
}: {
  children: React.ReactNode;
  user: StudioUser;
  conversations: ConversationSummary[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="border-border bg-sidebar hidden w-64 shrink-0 border-r md:block">
        <StudioNav user={user} conversations={conversations} />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="border-border flex items-center gap-3 border-b px-3 py-2.5 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-sidebar w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <StudioNav
                user={user}
                conversations={conversations}
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
