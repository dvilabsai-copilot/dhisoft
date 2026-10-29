import { adminRequest, sameOrigin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const denied = sameOrigin(request);
  if (denied) return denied;
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;"))
    return Response.json(
      { message: "Upload must use multipart/form-data." },
      { status: 400 },
    );
  try {
    const response = await adminRequest(
      "/admin/media/project-video",
      {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: request.body,
        duplex: "half",
      } as RequestInit,
      { timeoutMs: 10 * 60 * 1000, retryUnauthorized: false },
    );
    return response;
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error && error.name === "AbortError"
            ? "The upload timed out."
            : "The upload service is unavailable.",
      },
      { status: 502 },
    );
  }
}
