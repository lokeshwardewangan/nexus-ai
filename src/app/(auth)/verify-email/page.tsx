import type { Metadata } from "next";

import { VerifyEmailCard } from "@/features/auth/components/verify-email-card";

export const metadata: Metadata = {
  title: "Check your email",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <VerifyEmailCard email={email ?? ""} />;
}
