import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAssistant } from "@/config/assistants";
import { ChatView } from "@/features/chat/components/chat-view";

type Params = { params: Promise<{ assistantId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { assistantId } = await params;
  const assistant = getAssistant(assistantId);
  return { title: assistant?.name ?? "Chat" };
}

export default async function AssistantChatPage({ params }: Params) {
  const { assistantId } = await params;
  if (!getAssistant(assistantId)) notFound();

  return <ChatView assistantId={assistantId} />;
}
