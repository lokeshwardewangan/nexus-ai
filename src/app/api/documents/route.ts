import { handleUploadDocument } from "@/server/controllers/document.controller";

export async function POST(request: Request) {
  return handleUploadDocument(request);
}
