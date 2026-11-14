"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductPreview from "@/components/home/ProductPreview";
import {
  projectVideoSource,
  resolveProjectMedia,
  youtubeThumbnailUrl,
} from "@/lib/project-media";
import type { CmsProject } from "@/types/cms";

export default function ProjectMedia({
  project,
  onPlay,
  className = "",
}: {
  project: CmsProject;
  onPlay?: (project: CmsProject) => void;
  className?: string;
}) {
  const media = resolveProjectMedia(project);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = projectVideoSource(project);
  const shouldUseFallback = failed || media.kind === "fallback";

  useEffect(() => {
    if (media.kind !== "mp4" || !videoRef.current) return;
    const video = videoRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "220px 0px" },
    );
    observer.observe(video);
    if (reduceMotion || saveData) video.pause();
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [media.kind]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || media.kind !== "mp4") return;
    if (
      !inView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
      )
    ) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [inView, media.kind]);

  if (shouldUseFallback) {
    return (
      <div className={`project-media-frame ${className}`}>
        <ProductPreview project={project} />
      </div>
    );
  }

  return (
    <div
      data-ui="product-demo"
      className={`project-media-frame group relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950 ${className}`}
    >
      {media.kind === "mp4" && (
        <video
          ref={videoRef}
          src={media.url}
          poster={project.posterImage}
          muted
          playsInline
          loop
          preload={inView ? "metadata" : "none"}
          onError={() => setFailed(true)}
          className="aspect-video h-full w-full object-cover"
          aria-label={`${project.title} application recording`}
        />
      )}
      {media.kind === "youtube" && (
        <>
          {youtubeThumbnailUrl(media.url) && (
            <img
              src={youtubeThumbnailUrl(media.url) ?? undefined}
              alt={`${project.title} demo thumbnail`}
              className="aspect-video h-full w-full object-cover"
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
        </>
      )}
      {media.kind === "poster" && (
        <img
          src={media.url}
          alt={`${project.title} application preview`}
          className="aspect-video h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      
{onPlay && (media.kind === "mp4" || media.kind === "youtube") && (
  <button
    type="button"
    onClick={() => onPlay(project)}
    className="project-play"

          aria-label={`Watch ${project.title} demo`}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-950">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
          <span>
            {source === "youtube" ? "Watch demo" : "Play recording"}
            {project.videoDuration ? ` · ${project.videoDuration}` : ""}
          </span>
        </button>
      )}
    </div>
  );
}
