"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const RESEND_COOLDOWN = 30;

export function VerifyEmailCard({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    const timer = setInterval(() => {
      setCooldown((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  }

  async function resend() {
    if (sending || cooldown > 0 || !email) return;
    setSending(true);

    if (isSupabaseConfigured) {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        toast.error(error.message);
        setSending(false);
        return;
      }
    }

    toast.success("Confirmation email sent");
    setSending(false);
    startCooldown();
  }

  return (
    <div className="text-center">
      <div className="ring-primary/20 bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl ring-1">
        <MailCheck className="size-7" />
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Check your <span className="text-gradient-brand">email</span>
      </h1>
      <p className="text-muted-foreground mx-auto mt-2.5 max-w-xs text-sm leading-relaxed">
        We&apos;ve sent a confirmation link to verify your account. Open it to finish setting up and
        sign in.
      </p>

      {email && (
        <div className="border-border bg-secondary/50 mx-auto mt-6 inline-flex max-w-full items-center gap-2.5 rounded-lg border px-4 py-2.5">
          <Mail className="text-muted-foreground size-4 shrink-0" />
          <span className="truncate text-sm font-medium">{email}</span>
        </div>
      )}

      <Button
        onClick={resend}
        disabled={sending || cooldown > 0}
        variant="outline"
        className="mt-8 w-full"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending…" : "Resend email"}
      </Button>

      <p className="text-muted-foreground mt-6 text-sm">
        Wrong address?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline">
          Go back
        </Link>{" "}
        or{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          log in
        </Link>
      </p>

      <p className="text-muted-foreground mt-8 text-xs">
        Can&apos;t find the email? Check your spam folder.
      </p>
    </div>
  );
}
