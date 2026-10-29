import type { CmsProject } from "@/types/cms";

export type ProjectVideoSource = "none" | "mp4" | "youtube";
export type ProjectMediaKind = "mp4" | "youtube" | "poster" | "fallback";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

export function parseYouTubeVideoId(
  value: string | undefined | null,
): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())
    )
      return null;
    let id = "";
    if (url.hostname.toLowerCase().endsWith("youtu.be"))
      id = url.pathname.slice(1);
    else if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
    else if (url.pathname.startsWith("/shorts/"))
      id = url.pathname.split("/")[2] ?? "";
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(
  value: string | undefined | null,
): string | null {
  const id = parseYouTubeVideoId(value);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : null;
}

export function youtubeThumbnailUrl(
  value: string | undefined | null,
): string | null {
  const id = parseYouTubeVideoId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function projectVideoSource(
  project: Pick<CmsProject, "videoSource" | "videoUrl">,
): ProjectVideoSource {
  if (project.videoSource) return project.videoSource;
  if (!project.videoUrl) return "none";
  return parseYouTubeVideoId(project.videoUrl) ? "youtube" : "mp4";
}

function safeMediaUrl(value: string | undefined): value is string {
  return Boolean(value && /^(\/(?!\/)|https:\/\/)[^<>"'`]*$/i.test(value));
}

export function resolveProjectMedia(project: CmsProject): {
  kind: ProjectMediaKind;
  url?: string;
} {
  const source = projectVideoSource(project);
  if (source === "mp4" && safeMediaUrl(project.videoUrl))
    return { kind: "mp4", url: project.videoUrl };
  if (source === "youtube" && parseYouTubeVideoId(project.videoUrl))
    return { kind: "youtube", url: project.videoUrl };
  if (safeMediaUrl(project.posterImage))
    return { kind: "poster", url: project.posterImage };
  return { kind: "fallback" };
}
