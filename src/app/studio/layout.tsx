import { StudioShell } from "@/features/studio/components/studio-shell";
import { getCurrentUser } from "@/server/services/user.service";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return <StudioShell user={user}>{children}</StudioShell>;
}
