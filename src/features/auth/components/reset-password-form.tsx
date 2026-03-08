"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { changePasswordSchema } from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isValid = changePasswordSchema.safeParse({ password, confirm }).success;
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Password must be at least 8 characters"
      : undefined;
  const confirmError =
    confirm.length > 0 && confirm !== password ? "Passwords don't match" : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = changePasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) return;
    if (!isSupabaseConfigured) {
      router.push("/studio");
      return;
    }

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password: parsed.data.password });
    if (error) {
      setLoading(false);
      toast.error(error.message); // keep the entered values so the user can retry
      return;
    }
    toast.success("Password updated");
    router.push("/studio");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      <p className="text-muted-foreground mt-1.5 text-sm">
        Choose a new password for your account.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(passwordError)}
          />
          {passwordError && <p className="text-destructive text-xs">{passwordError}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <PasswordInput
            id="confirm"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(confirmError)}
          />
          {confirmError && <p className="text-destructive text-xs">{confirmError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={!isValid || loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
