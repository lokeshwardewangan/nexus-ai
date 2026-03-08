"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { changePasswordSchema } from "@/lib/validations/auth";
import { profileSchema } from "@/lib/validations/profile";
import type { Profile } from "@/types/profile";
import { updateAvatarAction, updateProfileAction } from "../actions";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const clearProfileError = (name: string) =>
    setProfileErrors((prev) => (prev[name] ? omit(prev, name) : prev));

  // Live password validation drives both the inline hints and the submit button.
  const passwordValid = changePasswordSchema.safeParse({ password, confirm }).success;
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Password must be at least 8 characters"
      : undefined;
  const confirmError =
    confirm.length > 0 && confirm !== password ? "Passwords don't match" : undefined;

  async function onAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be under 2 MB");
      return;
    }
    if (!isSupabaseConfigured) {
      toast.error("Account features aren't configured");
      return;
    }

    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${profile.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploadingAvatar(false);
      toast.error(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const result = await updateAvatarAction(publicUrl);
    setUploadingAvatar(false);

    if (result.ok) {
      setAvatarUrl(publicUrl);
      toast.success("Photo updated");
      router.refresh();
    } else {
      toast.error(result.error ?? "Couldn't update your photo");
    }
  }

  async function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = profileSchema.safeParse({
      fullName: String(data.fullName ?? ""),
      username: String(data.username ?? ""),
      headline: String(data.headline ?? ""),
      bio: String(data.bio ?? ""),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] ??= issue.message;
      }
      setProfileErrors(fieldErrors);
      return;
    }

    setProfileErrors({});
    setSavingProfile(true);
    const result = await updateProfileAction(parsed.data);
    setSavingProfile(false);
    if (result.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else if (result.fieldErrors) {
      setProfileErrors(result.fieldErrors);
    } else {
      toast.error(result.error ?? "Couldn't update your profile");
    }
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = changePasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) return;
    if (!isSupabaseConfigured) {
      toast.error("Account features aren't configured");
      return;
    }

    setSavingPassword(true);
    const { error } = await createClient().auth.updateUser({ password: parsed.data.password });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message); // keep the entered values so the user can retry
      return;
    }
    toast.success("Password updated");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="space-y-10">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
          aria-label="Change profile photo"
          className="group focus-visible:ring-ring relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        >
          <Avatar className="size-16">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="" className="object-cover" />}
            <AvatarFallback className="bg-brand-gradient text-lg font-semibold text-white">
              {initials(profile.fullName, profile.email)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
            {uploadingAvatar ? (
              <Loader2 className="size-5 animate-spin text-white" />
            ) : (
              <Camera className="size-5 text-white" />
            )}
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          className="hidden"
        />
        <div className="min-w-0">
          <p className="truncate font-medium">
            {profile.fullName || profile.username || "Your name"}
          </p>
          {profile.username && (
            <p className="text-muted-foreground truncate text-sm">@{profile.username}</p>
          )}
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
            autoComplete="name"
            error={profileErrors.fullName}
            onChange={() => clearProfileError("fullName")}
          />
          <Field
            label="Username"
            name="username"
            defaultValue={profile.username}
            placeholder="janedoe"
            autoComplete="off"
            hint="Letters, numbers, and underscores"
            error={profileErrors.username}
            onChange={() => clearProfileError("username")}
          />
        </div>
        <Field
          label="What you do"
          name="headline"
          defaultValue={profile.headline}
          placeholder="Frontend Engineer at Acme"
          error={profileErrors.headline}
          onChange={() => clearProfileError("headline")}
        />
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio}
            rows={3}
            maxLength={280}
            placeholder="A short bio about yourself…"
            aria-invalid={Boolean(profileErrors.bio)}
            onChange={() => clearProfileError("bio")}
          />
          {profileErrors.bio && <p className="text-destructive text-xs">{profileErrors.bio}</p>}
        </div>
        <Button type="submit" disabled={savingProfile}>
          {savingProfile && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </form>

      {/* Password */}
      <form onSubmit={onPasswordSubmit} className="border-border space-y-5 border-t pt-10">
        <SectionHeading
          title="Password"
          description="Use at least 8 characters. You'll stay signed in after changing it."
        />
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <Button type="submit" variant="outline" disabled={!passwordValid || savingPassword}>
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
  hint?: string;
  error?: string;
  onChange?: () => void;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  hint,
  error,
  onChange,
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
        aria-invalid={Boolean(error)}
        onChange={onChange}
      />
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

function omit(source: Record<string, string>, key: string): Record<string, string> {
  const next = { ...source };
  delete next[key];
  return next;
}
