import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/profile/components/profile-form";
import { getProfile } from "@/server/services/profile.service";

export const metadata: Metadata = {
  title: "Account",
};

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/studio");

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="text-muted-foreground mt-1.5">Manage your profile and password.</p>
        </header>

        <div className="mt-8">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
