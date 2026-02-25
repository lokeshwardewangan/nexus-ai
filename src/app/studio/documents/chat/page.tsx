import type { Metadata } from "next";

import { DocsChatView } from "@/features/documents/components/docs-chat-view";
import { listDocuments } from "@/server/services/document.service";

export const metadata: Metadata = {
  title: "Chat with documents",
};

export default async function DocumentsChatPage() {
  const documents = (await listDocuments()).filter((doc) => doc.status === "ready");

  return <DocsChatView documents={documents} />;
}
