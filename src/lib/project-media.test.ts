import { describe, expect, it } from "vitest";
import { defaultHomeContent } from "@/content/default-home-content";
import {
  parseYouTubeVideoId,
  projectVideoSource,
  resolveProjectMedia,
  youtubeEmbedUrl,
} from "@/lib/project-media";
import type { CmsProject } from "@/types/cms";

const base: CmsProject = {
  key: "demo",
  slug: "demo",
  title: "Demo",
  eyebrow: "Demo",
  category: "Workflow",
  shortDescription: "Short",
  description: "Long",
  visual: "rural",
  stack: [],
  capabilities: [],
  status: "Live",
  featured: true,
  sortOrder: 1,
  isActive: true,
};

describe("portfolio project 06", () => {
  it("replaces the Commerce API entry with Voya without reusing its shared MP4", () => {
    const projects = defaultHomeContent.portfolio?.projects ?? [];
    const project = projects.find((item) => item.sortOrder === 60);

    expect(project).toMatchObject({
      key: "voya-vendor-platform",
      title: "Voya Vendor Platform",
      eyebrow: "Travel",
      category: "B2B platform",
      visual: "voya",
      videoSource: "none",
      liveDemoUrl: "https://demo.dhisoft.in/voya",
      capabilities: [
        "Vendor onboarding",
        "Experience catalogue",
        "Booking operations",
      ],
    });
    expect(project?.videoUrl).toBeUndefined();
    expect(project?.githubUrl).toBeUndefined();
    expect(project && resolveProjectMedia(project).kind).toBe("fallback");
    expect(projects.some((item) => item.key === "commerce-api")).toBe(false);
  });
});

describe("project media contract", () => {
  it("parses supported YouTube URL shapes and rejects arbitrary URLs", () => {
    expect(
      parseYouTubeVideoId("https://www.youtube.com/watch?v=abc123XYZ_-"),
    ).toBe("abc123XYZ_-");
    expect(parseYouTubeVideoId("https://youtu.be/abc123XYZ_-")).toBe(
      "abc123XYZ_-",
    );
    expect(
      parseYouTubeVideoId("https://www.youtube.com/shorts/abc123XYZ_-"),
    ).toBe("abc123XYZ_-");
    expect(
      parseYouTubeVideoId("https://example.com/watch?v=abc123XYZ_-"),
    ).toBeNull();
  });

  it("generates a youtube-nocookie URL only for supported videos", () => {
    expect(youtubeEmbedUrl("https://youtu.be/abc123XYZ_-")).toContain(
      "youtube-nocookie.com/embed/abc123XYZ_-",
    );
    expect(youtubeEmbedUrl("not-a-youtube-url")).toBeNull();
  });

  it("prioritizes MP4, then YouTube, then poster, then ProductPreview fallback", () => {
    expect(
      resolveProjectMedia({
        ...base,
        videoSource: "mp4",
        videoUrl: "/media/projects/demo.mp4",
        posterImage: "/poster.jpg",
      }).kind,
    ).toBe("mp4");
    expect(
      resolveProjectMedia({
        ...base,
        videoSource: "youtube",
        videoUrl: "https://youtu.be/abc123XYZ_-",
        posterImage: "/poster.jpg",
      }).kind,
    ).toBe("youtube");
    expect(
      resolveProjectMedia({ ...base, posterImage: "/poster.jpg" }).kind,
    ).toBe("poster");
    expect(resolveProjectMedia(base).kind).toBe("fallback");
    expect(
      projectVideoSource({ videoUrl: "https://youtu.be/abc123XYZ_-" }),
    ).toBe("youtube");
  });
});
