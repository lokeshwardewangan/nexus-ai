"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Account menu. The signed-in user is a placeholder until Supabase auth is
 * wired; "Log out" returns to the login screen.
 */
export function UserMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Jane Doe</p>
            <p className="text-muted-foreground truncate text-xs">jane@example.com</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/login")}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
