"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/types/profile";
import { updateProfileAction } from "../actions";

function initials(name: string, email: string): string {
  const source = name.trim() || email;
  return (
    source
      .split(/[\s@.]+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setSavingProfile(true);
    const result = await updateProfileAction({
      fullName: String(data.fullName ?? ""),
      username: String(data.username ?? ""),
      headline: String(data.headline ?? ""),
      bio: String(data.bio ?? ""),
    });
    setSavingProfile(false);
    if (result.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error(result.error ?? "Couldn't update your profile");
    }
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const password = String(data.password ?? "");
    const confirm = String(data.confirm ?? "");

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (!isSupabaseConfigured) {
      toast.error("Account features aren't configured");
      return;
    }

    setSavingPassword(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      form.reset();
    }
  }

  return (
    <div className="space-y-10">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="bg-brand-gradient text-lg font-semibold text-white">
            {initials(profile.fullName, profile.email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {profile.fullName || profile.username || "Your name"}
          </p>
          <p className="text-muted-foreground truncate text-sm">{profile.email}</p>
        </div>
      </div>

      {/* Profile details */}
      <form onSubmit={onProfileSubmit} className="space-y-5">
        <SectionHeading
          title="Profile"
          description="This personalizes your studio. Your bio and role are yours to share."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            name="fullName"
            defaultValue={profile.fullName}
            placeholder="Jane Doe"
          />
          <Field
            label="Username"
            name="username"
            defaultValue={profile.username}
            placeholder="janedoe"
          />
        </div>
        <Field
          label="What you do"
          name="headline"
          defaultValue={profile.headline}
          placeholder="Frontend Engineer at Acme"
        />
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio}
            rows={3}
            placeholder="A short bio about yourself…"
          />
        </div>
        <Button type="submit" disabled={savingProfile}>
          {savingProfile && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </form>

      {/* Password */}
      <form onSubmit={onPasswordSubmit} className="border-border space-y-5 border-t pt-10">
        <SectionHeading title="Password" description="Set a new password for your account." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="New password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <Field
            label="Confirm password"
            name="confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" variant="outline" disabled={savingPassword}>
          {savingPassword && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
      />
    </div>
  );
}
