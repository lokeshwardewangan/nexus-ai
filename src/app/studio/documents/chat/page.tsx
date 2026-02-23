import type { Metadata } from "next";

import { DocsChatView } from "@/features/documents/components/docs-chat-view";

export const metadata: Metadata = {
  title: "Chat with documents",
};

export default function DocumentsChatPage() {
  return <DocsChatView />;
}
