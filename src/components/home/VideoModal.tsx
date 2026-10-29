"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { projectVideoSource, youtubeEmbedUrl } from "@/lib/project-media";
import type { CmsProject } from "@/types/cms";

export default function VideoModal({
  project,
  onClose,
}: {
  project: CmsProject;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const source = projectVideoSource(project);
  const embedUrl = youtubeEmbedUrl(project.videoUrl);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          aria-label="Close demo video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video bg-black">
          {source === "youtube" && embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${project.title} demo video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : source === "mp4" && project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full"
              aria-label={`${project.title} demo video`}
            />
          ) : (
            <div className="grid h-full place-items-center px-8 text-center text-slate-300">
              <div>
                <p className="text-lg font-semibold text-white">
                  Demo recording coming soon
                </p>
                <p className="mt-2 max-w-md text-sm">
                  The product surface is available above. A walkthrough will be
                  added here when the recording is ready.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p
              id="video-modal-title"
              className="text-sm font-semibold text-white"
            >
              {project.title}
            </p>
            <p className="mt-1 text-xs text-slate-400">{project.status}</p>
          </div>
          <p className="text-xs text-slate-500">
            No audio autoplay / keyboard accessible
          </p>
        </div>
      </div>
    </div>
  );
}
