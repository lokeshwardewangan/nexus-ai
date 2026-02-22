import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getConversationView } from "@/server/services/conversation.service";
import { ChatView } from "@/features/chat/components/chat-view";

type Params = { params: Promise<{ conversationId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { conversationId } = await params;
  const view = await getConversationView(conversationId);
  return { title: view?.title ?? "Chat" };
}

export default async function ConversationPage({ params }: Params) {
  const { conversationId } = await params;
  const view = await getConversationView(conversationId);
  if (!view) notFound();

  return (
    <ChatView
      assistantId={view.assistantId}
      conversationId={conversationId}
      initialMessages={view.messages}
    />
  );
}
