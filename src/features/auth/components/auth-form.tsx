"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { OAuthButtons } from "./oauth-buttons";

type Mode = "login" | "signup";

const copy: Record<
  Mode,
  { title: string; subtitle: string; action: string; switchText: string; href: string; cta: string }
> = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to your Nexus studio.",
    action: "Log in",
    switchText: "Don't have an account?",
    href: "/signup",
    cta: "Sign up",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start using 12 AI assistants in seconds.",
    action: "Create account",
    switchText: "Already have an account?",
    href: "/login",
    cta: "Log in",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const text = copy[mode];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const schema = mode === "signup" ? signupSchema : loginSchema;
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Without Supabase keys, run in demo mode and just enter the studio.
    if (!isSupabaseConfigured) {
      router.push("/studio");
      return;
    }

    const supabase = createClient();
    const email = String(data.email);
    const password = String(data.password);

    if (mode === "signup") {
      const { data: signUp, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: String(data.name) },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (signUp.session) {
        router.push("/studio");
        router.refresh();
      } else {
        // Email confirmation required — show the dedicated check-email page.
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    router.push("/studio");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{text.title}</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">{text.subtitle}</p>
      </div>

      <OAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or continue with email</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "signup" && (
          <Field
            label="Name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            error={errors.name}
          />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          error={errors.password}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {text.action}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {text.switchText}{" "}
        <Link href={text.href} className="text-foreground font-medium hover:underline">
          {text.cta}
        </Link>
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
}

function Field({ label, name, type, placeholder, autoComplete, error }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
