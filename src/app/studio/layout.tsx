import { StudioShell } from "@/features/studio/components/studio-shell";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
