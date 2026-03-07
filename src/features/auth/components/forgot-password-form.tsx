"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setLoading(true);
    if (isSupabaseConfigured) {
      const { error } = await createClient().auth.resetPasswordForEmail(value, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="ring-primary/20 bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl ring-1">
          <MailCheck className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground mx-auto mt-2.5 max-w-xs text-sm leading-relaxed">
          If an account exists for <span className="text-foreground font-medium">{email}</span>, we
          sent a link to reset your password.
        </p>
        <Button asChild variant="outline" className="mt-8 w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-muted-foreground mt-1.5 text-sm">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
    </div>
  );
}
