import { handleDocumentChat } from "@/server/controllers/document.controller";

export async function POST(request: Request) {
  return handleDocumentChat(request);
}
