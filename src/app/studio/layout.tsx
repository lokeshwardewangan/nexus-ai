import { StudioShell } from "@/features/studio/components/studio-shell";
import { getCurrentUser } from "@/server/services/user.service";
import { listRecentConversations } from "@/server/services/conversation.service";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const [user, conversations] = await Promise.all([getCurrentUser(), listRecentConversations()]);

  return (
    <StudioShell user={user} conversations={conversations}>
      {children}
    </StudioShell>
  );
}
