"use client";

import { useEffect, useState } from "react";
import HomePageClient from "@/components/home/HomePageClient";
import {
  parseYouTubeVideoId,
  projectVideoSource,
  youtubeThumbnailUrl,
} from "@/lib/project-media";
import type {
  CmsCapability,
  CmsLink,
  CmsProduct,
  CmsProject,
  HomeContent,
} from "@/types/cms";

type Role = "SUPER_ADMIN" | "EDITOR" | "VIEWER";
type AdminHome = {
  draftVersion: number;
  draftContent: HomeContent;
  publishedVersion: number;
  publishedAt: string | null;
};
type Revision = {
  id: string;
  version: number;
  action: string;
  note: string | null;
  createdAt: string;
  actor?: { name: string } | null;
};
const blankItem = (key: string): CmsProduct => ({
  key,
  icon: "Sparkles",
  title: "New item",
  text: "Describe this offering.",
  sortOrder: 99,
  isActive: true,
});

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      />
    </label>
  );
}
function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      />
    </label>
  );
}
function ListArea({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Area
      label={`${label} (one per line)`}
      value={values.join("\n")}
      onChange={(value) =>
        onChange(
          value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      }
    />
  );
}

function ProjectMediaEditor({
  project,
  editable,
  onChange,
}: {
  project: CmsProject;
  editable: boolean;
  onChange: (patch: Partial<CmsProject>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const source = projectVideoSource(project);
  const currentFilename = project.videoUrl?.split("/").pop() ?? "";
  async function upload(file: File) {
    if (
      !file.name.toLowerCase().endsWith(".mp4") ||
      file.type !== "video/mp4"
    ) {
      setYoutubeError("Choose an MP4 file with MIME type video/mp4.");
      return;
    }
    setSelectedName(file.name);
    setYoutubeError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/media/project-video", {
        method: "POST",
        body: form,
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          body &&
            typeof body === "object" &&
            typeof (body as Record<string, unknown>).message === "string"
            ? (body as Record<string, string>).message
            : `Upload failed (${response.status}).`,
        );
      const payload = body as { url?: string };
      if (!payload.url)
        throw new Error("Upload response did not include a media URL.");
      onChange({ videoSource: "mp4", videoUrl: payload.url });
    } catch (error) {
      setYoutubeError(
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }
  function setYouTube(value: string) {
    const valid = !value || Boolean(parseYouTubeVideoId(value));
    setYoutubeError(
      valid ? "" : "Use a YouTube watch, youtu.be, or shorts URL.",
    );
    onChange({ videoSource: "youtube", videoUrl: value });
  }
  function clearMedia() {
    setSelectedName("");
    setYoutubeError("");
    onChange({ videoSource: "none", videoUrl: undefined });
  }
  return (
    <div
      className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
      data-testid={`project-media-${project.key}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Project media</p>
          <p className="mt-1 text-xs text-slate-500">
            Use a real MP4 recording or a public YouTube link. The homepage
            keeps the product preview as a safe fallback.
          </p>
        </div>
        {source !== "none" && (
          <button
            type="button"
            disabled={!editable || uploading}
            onClick={clearMedia}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Clear video
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <input
            type="radio"
            name={`video-source-${project.key}`}
            checked={source === "none"}
            disabled={!editable || uploading}
            onChange={clearMedia}
          />{" "}
          No video
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <input
            type="radio"
            name={`video-source-${project.key}`}
            checked={source === "mp4"}
            disabled={!editable || uploading}
            onChange={() =>
              onChange({
                videoSource: "mp4",
                videoUrl: source === "mp4" ? project.videoUrl : undefined,
              })
            }
          />{" "}
          Upload MP4
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <input
            type="radio"
            name={`video-source-${project.key}`}
            checked={source === "youtube"}
            disabled={!editable || uploading}
            onChange={() =>
              onChange({
                videoSource: "youtube",
                videoUrl: source === "youtube" ? project.videoUrl : undefined,
              })
            }
          />{" "}
          YouTube link
        </label>
      </div>
      {source === "mp4" && (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr] md:items-start">
          <label className="block text-sm font-medium text-slate-700">
            MP4 recording
            <input
              type="file"
              accept=".mp4,video/mp4"
              disabled={!editable || uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
            {uploading && (
              <span className="mt-2 block text-xs text-blue-600">
                Uploading {selectedName}…
              </span>
            )}
            {!uploading && (currentFilename || selectedName) && (
              <span className="mt-2 block truncate text-xs text-slate-500">
                Current file: {currentFilename || selectedName}
              </span>
            )}
          </label>
          {project.videoUrl && (
            <video
              src={project.videoUrl}
              controls
              muted
              preload="metadata"
              className="aspect-video w-full rounded-lg bg-slate-950 object-cover"
              aria-label={`${project.title} uploaded preview`}
            />
          )}
        </div>
      )}
      {source === "youtube" && (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr] md:items-start">
          <label className="block text-sm font-medium text-slate-700">
            Public YouTube URL
            <input
              type="url"
              value={project.videoUrl ?? ""}
              disabled={!editable || uploading}
              onChange={(event) => setYouTube(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            />
            {youtubeError && (
              <span className="mt-2 block text-xs text-red-600" role="alert">
                {youtubeError}
              </span>
            )}
          </label>
          {youtubeThumbnailUrl(project.videoUrl) && (
            <img
              src={youtubeThumbnailUrl(project.videoUrl) ?? undefined}
              alt={`${project.title} YouTube preview`}
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}
      {source !== "none" && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            label="Video duration"
            value={project.videoDuration ?? ""}
            onChange={(value) => onChange({ videoDuration: value })}
          />
          <Input
            label="Poster image path (optional)"
            value={project.posterImage ?? ""}
            onChange={(value) => onChange({ posterImage: value || undefined })}
          />
        </div>
      )}
    </div>
  );
}

export default function CmsEditor({ role }: { role: Role }) {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [version, setVersion] = useState(0);
  const [publishedVersion, setPublishedVersion] = useState(0);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("Loading draft…");
  const [error, setError] = useState("");
  const editable = role !== "VIEWER";
  async function load() {
    setStatus("Loading draft…");
    try {
      const [homeResponse, revisionsResponse] = await Promise.all([
        fetch("/api/admin/cms"),
        fetch("/api/admin/cms/revisions"),
      ]);
      if (!homeResponse.ok)
        throw new Error("Could not load the homepage draft.");
      const home: AdminHome = (await homeResponse.json()) as AdminHome;
      setContent(home.draftContent);
      setVersion(home.draftVersion);
      setPublishedVersion(home.publishedVersion);
      if (revisionsResponse.ok)
        setRevisions((await revisionsResponse.json()) as Revision[]);
      setDirty(false);
      setStatus("Draft loaded");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load the draft.",
      );
      setStatus("");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(next: HomeContent) {
    setContent(next);
    setDirty(true);
    setStatus("Unsaved changes");
  }
  function setField(section: keyof HomeContent, field: string, value: string) {
    if (!content) return;
    if (section === "navigation")
      change({
        ...content,
        navigation: { ...content.navigation, [field]: value },
      });
  }
  function updateProduct(index: number, patch: Partial<CmsProduct>) {
    if (!content) return;
    change({
      ...content,
      products: {
        ...content.products,
        items: content.products.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    });
  }
  function updateCapability(index: number, patch: Partial<CmsCapability>) {
    if (!content) return;
    change({
      ...content,
      capabilities: {
        ...content.capabilities,
        items: content.capabilities.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    });
  }
  function updateProject(index: number, patch: Partial<CmsProject>) {
    if (!content?.portfolio) return;
    change({
      ...content,
      portfolio: {
        ...content.portfolio,
        projects: content.portfolio.projects.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    });
  }
  function reorder(
    kind: "products" | "capabilities",
    index: number,
    delta: -1 | 1,
  ) {
    if (!content) return;
    const items =
      kind === "products"
        ? content.products.items.slice()
        : content.capabilities.items.slice();
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    change(
      kind === "products"
        ? { ...content, products: { ...content.products, items } }
        : { ...content, capabilities: { ...content.capabilities, items } },
    );
  }
  async function save(publish: boolean) {
    if (!content || !editable) return;
    const invalidYouTube = content.portfolio?.projects.find(
      (project) =>
        projectVideoSource(project) === "youtube" &&
        !parseYouTubeVideoId(project.videoUrl),
    );
    if (invalidYouTube) {
      setError(
        `Add a valid YouTube URL for ${invalidYouTube.title} before saving.`,
      );
      return;
    }
    setStatus(publish ? "Publishing…" : "Saving draft…");
    setError("");
    const response = await fetch(
      publish ? "/api/admin/cms/publish" : "/api/admin/cms/draft",
      {
        method: publish ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publish ? { version } : { version, content }),
      },
    );
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        body &&
        typeof body === "object" &&
        typeof (body as Record<string, unknown>).message === "string"
          ? (body as Record<string, string>).message
          : `Request failed (${response.status}).`;
      setError(response.status === 409 ? `Conflict: ${message}` : message);
      setStatus("");
      return;
    }
    if (
      !publish &&
      body &&
      typeof body === "object" &&
      typeof (body as Record<string, unknown>).draftVersion === "number"
    )
      setVersion((body as Record<string, number>).draftVersion);
    if (publish) setPublishedVersion(version);
    setDirty(false);
    setStatus(publish ? "Published" : "Draft saved");
    void load();
  }
  async function rollback(revision: Revision) {
    if (
      role !== "SUPER_ADMIN" ||
      !window.confirm(
        `Restore revision ${revision.version} (${revision.action})? This creates a new draft version.`,
      )
    )
      return;
    const response = await fetch(
      `/api/admin/cms/revisions/${encodeURIComponent(revision.id)}/rollback`,
      { method: "POST" },
    );
    if (!response.ok) {
      setError("Rollback failed.");
      return;
    }
    await load();
  }
  if (!content)
    return (
      <p className="rounded-2xl bg-white p-6" role="status">
        {status || error}
      </p>
    );
  if (preview)
    return (
      <div>
        <button
          onClick={() => setPreview(false)}
          className="mb-6 rounded-full bg-slate-950 px-5 py-2.5 font-semibold text-white"
        >
          Back to editor
        </button>
        <HomePageClient content={content} />
      </div>
    );
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Homepage content
          </p>
          <h1 className="text-3xl font-bold">Draft editor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Draft v{version} · Published v{publishedVersion} · {status}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(true)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold"
          >
            Preview
          </button>
          <button
            disabled={!editable || !dirty}
            onClick={() => void save(false)}
            className="rounded-full bg-slate-700 px-4 py-2 font-semibold text-white disabled:opacity-40"
          >
            Save Draft
          </button>
          <button
            disabled={!editable}
            onClick={() => void save(true)}
            className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-40"
          >
            Publish
          </button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {!editable && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Viewer access is read-only.
        </p>
      )}
      <fieldset disabled={!editable} className="contents">
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <fieldset className="space-y-4 rounded-2xl bg-white p-6">
            <legend className="text-lg font-bold">Navigation and hero</legend>
            <Input
              label="Brand name"
              value={content.navigation.brandName}
              onChange={(value) => setField("navigation", "brandName", value)}
            />
            <Input
              label="Logo text"
              value={content.navigation.logoText}
              onChange={(value) => setField("navigation", "logoText", value)}
            />
            <ListArea
              label="Audience ticker"
              values={content.audiences}
              onChange={(audiences) => change({ ...content, audiences })}
            />
            <Input
              label="Hero background image path"
              value={content.hero.backgroundImage}
              onChange={(value) =>
                change({
                  ...content,
                  hero: { ...content.hero, backgroundImage: value },
                })
              }
            />
            <Input
              label="Hero badge"
              value={content.hero.badge}
              onChange={(value) =>
                change({ ...content, hero: { ...content.hero, badge: value } })
              }
            />
            <Input
              label="Hero title"
              value={content.hero.titlePrefix}
              onChange={(value) =>
                change({
                  ...content,
                  hero: { ...content.hero, titlePrefix: value },
                })
              }
            />
            <Input
              label="Hero highlight"
              value={content.hero.titleHighlight}
              onChange={(value) =>
                change({
                  ...content,
                  hero: { ...content.hero, titleHighlight: value },
                })
              }
            />
            <Area
              label="Hero description"
              value={content.hero.description}
              onChange={(value) =>
                change({
                  ...content,
                  hero: { ...content.hero, description: value },
                })
              }
            />
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6">
            <legend className="text-lg font-bold">SEO</legend>
            <Input
              label="Title"
              value={content.seo.title}
              onChange={(value) =>
                change({ ...content, seo: { ...content.seo, title: value } })
              }
            />
            <Area
              label="Description"
              value={content.seo.description}
              onChange={(value) =>
                change({
                  ...content,
                  seo: { ...content.seo, description: value },
                })
              }
            />
            <ListArea
              label="Keywords"
              values={content.seo.keywords}
              onChange={(keywords) =>
                change({ ...content, seo: { ...content.seo, keywords } })
              }
            />
            <Input
              label="Open Graph image path"
              value={content.seo.ogImage ?? ""}
              onChange={(value) =>
                change({ ...content, seo: { ...content.seo, ogImage: value } })
              }
            />
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6 lg:col-span-2">
            <legend className="text-lg font-bold">Products</legend>
            {content.products.items.map((item, index) => (
              <ItemEditor
                key={item.key}
                item={item}
                onChange={(patch) => updateProduct(index, patch)}
                onDelete={() =>
                  change({
                    ...content,
                    products: {
                      ...content.products,
                      items: content.products.items.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    },
                  })
                }
                onMove={(delta) => reorder("products", index, delta)}
              />
            ))}
            <button
              disabled={!editable}
              onClick={() =>
                change({
                  ...content,
                  products: {
                    ...content.products,
                    items: [
                      ...content.products.items,
                      blankItem(`product-${Date.now()}`),
                    ],
                  },
                })
              }
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Add product
            </button>
          </fieldset>
          {content.portfolio && (
            <fieldset className="space-y-4 rounded-2xl bg-white p-6 lg:col-span-2">
              <legend className="text-lg font-bold">Selected work</legend>
              <p className="text-sm text-slate-500">
                Edit the portfolio metadata and ordering. Media URLs are
                optional; projects without media use the built-in product
                surface preview.
              </p>
              {content.portfolio.projects.map((item, index) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(value) =>
                        updateProject(index, { title: value })
                      }
                    />
                    <Input
                      label="Category"
                      value={item.category}
                      onChange={(value) =>
                        updateProject(index, { category: value })
                      }
                    />
                    <Input
                      label="Status"
                      value={item.status}
                      onChange={(value) =>
                        updateProject(index, { status: value })
                      }
                    />
                    <Input
                      label="Sort order"
                      type="number"
                      value={String(item.sortOrder)}
                      onChange={(value) =>
                        updateProject(index, { sortOrder: Number(value) || 0 })
                      }
                    />
                  </div>
                  <Area
                    label="Short description"
                    value={item.shortDescription}
                    onChange={(value) =>
                      updateProject(index, { shortDescription: value })
                    }
                  />
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <ListArea
                      label="Stack"
                      values={item.stack}
                      onChange={(value) =>
                        updateProject(index, { stack: value })
                      }
                    />
                    <ListArea
                      label="Capabilities"
                      values={item.capabilities}
                      onChange={(value) =>
                        updateProject(index, { capabilities: value })
                      }
                    />
                  </div>
                  <ProjectMediaEditor
                    project={item}
                    editable={editable}
                    onChange={(patch) => updateProject(index, patch)}
                  />
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Input
                      label="Live demo URL"
                      value={item.liveDemoUrl ?? ""}
                      onChange={(value) =>
                        updateProject(index, {
                          liveDemoUrl: value || undefined,
                        })
                      }
                    />
                    <Input
                      label="GitHub URL"
                      value={item.githubUrl ?? ""}
                      onChange={(value) =>
                        updateProject(index, { githubUrl: value || undefined })
                      }
                    />
                    <Input
                      label="Case study URL"
                      value={item.caseStudyUrl ?? ""}
                      onChange={(value) =>
                        updateProject(index, {
                          caseStudyUrl: value || undefined,
                        })
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.featured}
                        onChange={(event) =>
                          updateProject(index, {
                            featured: event.target.checked,
                          })
                        }
                      />{" "}
                      Featured
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(event) =>
                          updateProject(index, {
                            isActive: event.target.checked,
                          })
                        }
                      />{" "}
                      Active
                    </label>
                  </div>
                </div>
              ))}
            </fieldset>
          )}
          <fieldset className="space-y-4 rounded-2xl bg-white p-6 lg:col-span-2">
            <legend className="text-lg font-bold">Platform features</legend>
            <Input
              label="Eyebrow"
              value={content.platform.eyebrow}
              onChange={(value) =>
                change({
                  ...content,
                  platform: { ...content.platform, eyebrow: value },
                })
              }
            />
            <Input
              label="Heading"
              value={content.platform.heading}
              onChange={(value) =>
                change({
                  ...content,
                  platform: { ...content.platform, heading: value },
                })
              }
            />
            <Area
              label="Description"
              value={content.platform.description}
              onChange={(value) =>
                change({
                  ...content,
                  platform: { ...content.platform, description: value },
                })
              }
            />
            <ListArea
              label="Features"
              values={content.platform.features}
              onChange={(features) =>
                change({
                  ...content,
                  platform: { ...content.platform, features },
                })
              }
            />
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6 lg:col-span-2">
            <legend className="text-lg font-bold">Capabilities</legend>
            {content.capabilities.items.map((item, index) => (
              <ItemEditor
                key={item.key}
                item={item}
                onChange={(patch) => updateCapability(index, patch)}
                onDelete={() =>
                  change({
                    ...content,
                    capabilities: {
                      items: content.capabilities.items.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    },
                  })
                }
                onMove={(delta) => reorder("capabilities", index, delta)}
              />
            ))}
            <button
              disabled={!editable}
              onClick={() =>
                change({
                  ...content,
                  capabilities: {
                    items: [
                      ...content.capabilities.items,
                      blankItem(`capability-${Date.now()}`),
                    ],
                  },
                })
              }
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Add capability
            </button>
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6">
            <legend className="text-lg font-bold">Pricing</legend>
            <Input
              label="Heading"
              value={content.pricing.heading}
              onChange={(value) =>
                change({
                  ...content,
                  pricing: { ...content.pricing, heading: value },
                })
              }
            />
            <Area
              label="Description"
              value={content.pricing.description}
              onChange={(value) =>
                change({
                  ...content,
                  pricing: { ...content.pricing, description: value },
                })
              }
            />
            <Input
              label="Card label"
              value={content.pricing.cardLabel}
              onChange={(value) =>
                change({
                  ...content,
                  pricing: { ...content.pricing, cardLabel: value },
                })
              }
            />
            <Input
              label="Price text"
              value={content.pricing.priceText}
              onChange={(value) =>
                change({
                  ...content,
                  pricing: { ...content.pricing, priceText: value },
                })
              }
            />
            <Area
              label="Card description"
              value={content.pricing.cardDescription}
              onChange={(value) =>
                change({
                  ...content,
                  pricing: { ...content.pricing, cardDescription: value },
                })
              }
            />
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6">
            <legend className="text-lg font-bold">Footer and contact</legend>
            <Input
              label="Brand name"
              value={content.footer.brandName}
              onChange={(value) =>
                change({
                  ...content,
                  footer: { ...content.footer, brandName: value },
                })
              }
            />
            <Area
              label="Description"
              value={content.footer.description}
              onChange={(value) =>
                change({
                  ...content,
                  footer: { ...content.footer, description: value },
                })
              }
            />
            <Input
              label="Email"
              value={content.footer.email}
              onChange={(value) =>
                change({
                  ...content,
                  footer: { ...content.footer, email: value },
                })
              }
            />
          </fieldset>
          <fieldset className="space-y-4 rounded-2xl bg-white p-6 lg:col-span-2">
            <legend className="text-lg font-bold">
              Safe dashboard scalars
            </legend>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Input
                label="Revenue"
                value={content.dashboard.revenue}
                onChange={(value) =>
                  change({
                    ...content,
                    dashboard: { ...content.dashboard, revenue: value },
                  })
                }
              />
              <Input
                label="Revenue target"
                value={content.dashboard.revenueTarget}
                onChange={(value) =>
                  change({
                    ...content,
                    dashboard: { ...content.dashboard, revenueTarget: value },
                  })
                }
              />
              <Input
                label="Uptime"
                value={content.dashboard.uptime}
                onChange={(value) =>
                  change({
                    ...content,
                    dashboard: { ...content.dashboard, uptime: value },
                  })
                }
              />
              <Input
                label="Data points"
                value={content.dashboard.dataPoints}
                onChange={(value) =>
                  change({
                    ...content,
                    dashboard: { ...content.dashboard, dataPoints: value },
                  })
                }
              />
              <Input
                label="Growth"
                value={content.dashboard.growth}
                onChange={(value) =>
                  change({
                    ...content,
                    dashboard: { ...content.dashboard, growth: value },
                  })
                }
              />
            </div>
          </fieldset>
        </div>
      </fieldset>
      <section className="mt-8 rounded-2xl bg-white p-6">
        <h2 className="text-lg font-bold">Revision history</h2>
        <div className="mt-4 space-y-2">
          {revisions.length === 0 ? (
            <p className="text-sm text-slate-500">No revisions yet.</p>
          ) : (
            revisions.map((revision) => (
              <div
                key={revision.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm"
              >
                <span>
                  v{revision.version} · {revision.action} ·{" "}
                  {revision.actor?.name ?? "system"} ·{" "}
                  {new Date(revision.createdAt).toLocaleString()}
                </span>
                {role === "SUPER_ADMIN" && (
                  <button
                    onClick={() => void rollback(revision)}
                    className="rounded-full border border-slate-300 px-3 py-1 font-semibold"
                  >
                    Rollback
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ItemEditor({
  item,
  onChange,
  onDelete,
  onMove,
}: {
  item: CmsProduct;
  onChange: (patch: Partial<CmsProduct>) => void;
  onDelete: () => void;
  onMove: (delta: -1 | 1) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="grid gap-3 md:grid-cols-5">
        <Input
          label="Stable key"
          value={item.key}
          onChange={(value) => onChange({ key: value })}
        />
        <Input
          label="Icon key"
          value={item.icon}
          onChange={(value) => onChange({ icon: value })}
        />
        <Input
          label="Title"
          value={item.title}
          onChange={(value) => onChange({ title: value })}
        />
        <Input
          label="Sort order"
          type="number"
          value={String(item.sortOrder)}
          onChange={(value) => onChange({ sortOrder: Number(value) || 0 })}
        />
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={item.isActive}
            onChange={(event) => onChange({ isActive: event.target.checked })}
          />{" "}
          Active
        </label>
      </div>
      <Area
        label="Text"
        value={item.text}
        onChange={(value) => onChange({ text: value })}
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onMove(-1)}
          className="rounded-full border px-3 py-1 text-sm"
        >
          Move up
        </button>
        <button
          onClick={() => onMove(1)}
          className="rounded-full border px-3 py-1 text-sm"
        >
          Move down
        </button>
        <button
          onClick={onDelete}
          className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
