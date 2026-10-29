"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  GitBranch,
  Globe2,
  History,
  Menu,
  Network,
  RefreshCw,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import ProductPreview from "@/components/home/ProductPreview";
import ProjectMedia from "@/components/home/ProjectMedia";
import VideoModal from "@/components/home/VideoModal";
import { getCmsIcon } from "@/lib/icon-map";
import { activeSorted, type CmsProject, type HomeContent } from "@/types/cms";
import { defaultHomeContent } from "@/content/default-home-content";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

function SectionIntro({
  eyebrow,
  heading,
  description,
  dark = false,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`section-eyebrow ${dark ? "text-cyan-300" : ""}`}>
        {eyebrow}
      </p>
      <h2
        className={`mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl ${dark ? "text-white" : "text-slate-950"}`}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-base leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function EcosystemVisual() {
  const labels = [
    { text: "Workforce", className: "left-0 top-12" },
    { text: "Travel", className: "right-4 top-4" },
    { text: "Commerce", className: "right-0 bottom-16" },
    { text: "Workflow", className: "left-12 bottom-2" },
  ];
  return (
    <div className="hero-visual relative mx-auto mt-16 max-w-6xl">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      {labels.map((label) => (
        <span
          key={label.text}
          className={`hero-label absolute ${label.className}`}
        >
          {label.text}
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
        </span>
      ))}
      <div className="relative mx-auto max-w-4xl rotate-[-2deg] rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-2 shadow-[0_40px_120px_rgba(2,6,23,0.38)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.3rem] border border-white/10 bg-slate-950">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-left text-[9px] text-slate-500">
              workspace.dhisoft / operating system
            </div>
            <div className="text-[9px] text-slate-500">
              Live product surface
            </div>
          </div>
          <div className="grid gap-5 p-5 md:grid-cols-[.85fr_1.15fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-300">
                    System overview
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    One workflow, clearly modelled.
                  </p>
                </div>
                <Activity className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="mt-8 space-y-4">
                {[
                  ["Inputs", "Users, data, integrations"],
                  ["Decisions", "States, rules, ownership"],
                  ["Outcomes", "Actions, records, reports"],
                ].map(([title, text], index) => (
                  <div key={title} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-xs font-semibold text-cyan-200">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-white">{title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Product surface
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="mt-4 text-xl font-semibold text-slate-950">
                  Built for the operator.
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    "Role-aware dashboards",
                    "Visible workflow state",
                    "Actionable next steps",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[10px] text-slate-600"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-left text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    System layer
                  </span>
                  <Code2 className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="mt-4 space-y-2 font-mono text-[10px]">
                  <p>
                    <span className="text-cyan-300">api</span> / workflows
                  </p>
                  <p>
                    <span className="text-violet-300">db</span> / tenant-safe
                    data
                  </p>
                  <p>
                    <span className="text-amber-300">jobs</span> / async
                    operations
                  </p>
                  <p>
                    <span className="text-emerald-300">ops</span> / health &
                    audit
                  </p>
                </div>
                <div className="mt-7 h-1.5 rounded-full bg-white/10">
                  <div className="h-1.5 w-[84%] rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onPlay,
}: {
  project: CmsProject;
  index: number;
  onPlay: (project: CmsProject) => void;
}) {
  const dark = project.visual === "rainwood" || project.visual === "mortgage";
  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.06 }}
      className={`project-card group ${dark ? "project-card-dark" : ""} ${index === 0 ? "md:col-span-2" : ""}`}
    >
      <div className="project-media">
        <ProductPreview project={project} />
        {(project.videoUrl || project.videoDuration) && (
          <button
            type="button"
            onClick={() => onPlay(project)}
            className="project-play"
            aria-label={`Watch ${project.title} demo`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-950 shadow-lg">
              <ArrowRight className="ml-0.5 h-4 w-4" />
            </span>
            <span>
              Watch demo
              {project.videoDuration ? ` · ${project.videoDuration}` : ""}
            </span>
          </button>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{project.eyebrow}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{project.category}</span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {project.shortDescription}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            {project.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {project.status}
          </span>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {project.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
            >
              View source on GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectShowcaseCard({
  project,
  index,
  onPlay,
}: {
  project: CmsProject;
  index: number;
  onPlay: (project: CmsProject) => void;
}) {
  const links = [
    project.liveDemoUrl
      ? { label: "Live demo", href: project.liveDemoUrl }
      : null,
    project.githubUrl
      ? { label: "View GitHub", href: project.githubUrl }
      : null,
    project.caseStudyUrl
      ? { label: "Case study", href: project.caseStudyUrl }
      : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item));
  return (
    <motion.article
      {...fadeUp}
      className={`project-showcase flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <ProjectMedia project={project} onPlay={onPlay} />
      </div>
      <div className="project-showcase-copy min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="text-blue-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{project.eyebrow}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{project.category}</span>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
          {project.shortDescription}
        </p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-medium text-slate-500"
            >
              {capability}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-4">
          {project.videoUrl && (
            <button
              type="button"
              onClick={() => onPlay(project)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600"
            >
              Watch demo <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function ProductUniverse({
  projects,
  onPlay,
}: {
  projects: CmsProject[];
  onPlay: (project: CmsProject) => void;
}) {
  const lead = projects[0];
  if (!lead) return null;
  return (
    <motion.div
      {...fadeUp}
      className="hero-product-universe relative mx-auto mt-14 max-w-7xl md:mt-16"
    >
      <div className="hero-product-grid absolute inset-0" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.72fr)] lg:items-stretch">
        <div className="hero-product-frame flex h-full flex-col rounded-[2rem] border border-white/15 bg-white/[0.08] p-3 shadow-[0_40px_120px_rgba(2,6,23,0.42)] backdrop-blur-xl">
          <ProjectMedia
            project={lead}
            onPlay={onPlay}
            className="border-white/15"
          />
          <div className="flex flex-wrap items-end justify-between gap-4 px-2 pb-1 pt-5 sm:px-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Featured build
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {lead.title}
              </p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-300">
              {lead.category}
            </span>
          </div>
        </div>
        <div className="hero-product-index rounded-[2rem] border border-white/10 bg-slate-950/35 p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Product index
              </p>
              <p className="mt-1 max-w-[15rem] text-sm font-medium leading-5 text-slate-200">
                A few of the systems we make easier to run.
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-300">03</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {projects.slice(1, 4).map((project, index) => (
            <div
              key={project.key}
              className="hero-product-chip"
            >
              <span className="mt-0.5 text-[10px] font-semibold text-cyan-300">
                0{index + 2}
              </span>
              <div>
                <p className="text-sm font-semibold tracking-[-0.01em] text-white">
                  {project.category}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {project.shortDescription}
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePageClient({ content }: { content: HomeContent }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [playing, setPlaying] = useState<CmsProject | null>(null);
  const portfolio = content.portfolio ?? defaultHomeContent.portfolio!;
  const domains = content.domains ?? defaultHomeContent.domains!;
  const principles = content.principles ?? defaultHomeContent.principles!;
  const engagement = content.engagement ?? defaultHomeContent.engagement!;
  const projects = activeSorted(portfolio.projects);
  const featured = projects.filter((project) => project.featured);
  const extra = projects.filter((project) => !project.featured);
  const capabilities = activeSorted(content.capabilities.items);
  const domainItems = activeSorted(domains.items);
  const principleItems = activeSorted(principles.items);
  const steps = activeSorted(engagement.steps);
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7f9] text-slate-950">
      <section className="hero-shell relative overflow-hidden px-5 pb-24 pt-5 text-white md:pb-32">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('${content.hero.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grid-bg absolute inset-0 opacity-20" />
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="DHISOFT home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-bold text-slate-950">
              {content.navigation.logoText}
            </span>
            <span className="text-sm font-bold tracking-[0.2em]">
              {content.navigation.brandName}
            </span>
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white md:hidden"
            onClick={() => setMobileNavOpen((value) => !value)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary navigation"
          >
            {content.navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={content.navigation.cta.href}
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              {content.navigation.cta.label}
            </a>
          </nav>
        </header>
        {mobileNavOpen && (
          <nav
            id="mobile-navigation"
            className="relative z-20 mt-4 grid gap-1 rounded-2xl border border-white/10 bg-slate-900/95 p-3 md:hidden"
            aria-label="Mobile navigation"
          >
            {content.navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={content.navigation.cta.href}
              onClick={() => setMobileNavOpen(false)}
              className="mt-1 rounded-xl bg-white px-3 py-3 text-center text-sm font-semibold text-slate-950"
            >
              {content.navigation.cta.label}
            </a>
          </nav>
        )}
        <div id="top" className="relative z-10 mx-auto max-w-7xl pt-20 md:pt-28">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.55fr)] lg:gap-16">
          <div className="max-w-[56rem]">
            <motion.div {...fadeUp} className="hero-kicker">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              {content.hero.badge}
            </motion.div>
            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-7 max-w-[56rem] text-5xl font-semibold leading-[0.94] tracking-[-0.065em] md:text-7xl lg:text-[5.8rem]"
            >
              {content.hero.titlePrefix}{" "}
              <span className="text-cyan-300">
                {content.hero.titleHighlight}
              </span>
            </motion.h1>
          </div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-1 max-w-sm border-l-0 border-t border-white/15 pt-6 lg:mt-9 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
          >
            <p className="max-w-sm text-base leading-7 text-slate-300 md:text-lg">
              {content.hero.description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={content.hero.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
              >
                {content.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={content.hero.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
              >
                {content.hero.secondaryCta.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-slate-400">
              <span className="h-px w-8 bg-cyan-300" />
              Built for the next decision
            </div>
          </motion.div>
          </div>
          <ProductUniverse
            projects={featured.length ? featured : projects}
            onPlay={setPlaying}
          />
        </div>
      </section>
      <section
        className="border-b border-slate-200 bg-white px-5 py-4"
        aria-label="DHISOFT focus areas"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:justify-between">
          {content.audiences.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <section
        id="work"
        className="section-shell mx-auto max-w-7xl px-5 py-24 md:py-32"
      >
        <SectionIntro
          eyebrow={portfolio.eyebrow}
          heading={portfolio.heading}
          description={portfolio.description}
        />
        <div id="products" className="mt-14 space-y-16">
          {featured.map((project, index) => (
            <ProjectShowcaseCard
              key={project.key}
              project={project}
              index={index}
              onPlay={setPlaying}
            />
          ))}
        </div>
        <div className="mt-20 space-y-16 border-t border-slate-200 pt-16">
          {extra.map((project, index) => (
            <ProjectShowcaseCard
              key={project.key}
              project={project}
              index={index + featured.length}
              onPlay={setPlaying}
            />
          ))}
        </div>
      </section>
      <section id="capabilities" className="bg-white px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow={content.products.eyebrow}
            heading={content.products.heading}
            description="The common thread across every domain is not a template. It is the ability to understand the operation and make its complexity usable."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {activeSorted(content.products.items).map((item, index) => {
              const Icon = getCmsIcon(item.icon);
              return (
                <motion.article
                  key={item.key}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className="capability-card"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {capabilities.map((item, index) => {
              const Icon = getCmsIcon(item.icon);
              return (
                <motion.article
                  key={item.key}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="domains"
        className="section-shell mx-auto max-w-7xl px-5 py-24 md:py-32"
      >
        <SectionIntro
          eyebrow={domains.eyebrow}
          heading={domains.heading}
          description="The industry changes. The product questions stay surprisingly consistent: who acts, what changes state, what must never be lost, and how does the team know what happens next?"
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {domainItems.map((domain, index) => (
            <motion.article
              key={domain.key}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.05 }}
              className="domain-card"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  0{index + 1}
                </span>
                <Globe2 className="h-4 w-4 text-slate-300" />
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">
                {domain.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {domain.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {domain.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      <section id="engineering" className="bg-slate-950 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            dark
            eyebrow={content.platform.eyebrow}
            heading={content.platform.heading}
            description={content.platform.description}
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="space-y-3">
              {[
                "Product experience",
                "API & application layer",
                "Business workflows",
                "Data & persistence",
                "Integration & automation",
                "Cloud & delivery",
              ].map((layer, index) => (
                <div key={layer} className="engineering-layer">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-xs font-semibold text-cyan-300">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{layer}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {
                        [
                          "React / Next.js / Angular",
                          "Node.js / NestJS",
                          "Domain services · state machines · authorization",
                          "PostgreSQL · MySQL · Prisma",
                          "REST · webhooks · queues · workers",
                          "AWS · Docker · CI/CD · observability",
                        ][index]
                      }
                    </p>
                  </div>
                  {index < 5 && (
                    <ChevronRight className="ml-auto hidden h-4 w-4 text-slate-600 lg:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    System thinking
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    From first interaction to reliable operation.
                  </p>
                </div>
                <Network className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                <div className="engineering-node">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <span>Rules & roles</span>
                </div>
                <div className="engineering-node">
                  <GitBranch className="h-4 w-4 text-violet-300" />
                  <span>States & events</span>
                </div>
                <div className="engineering-node">
                  <RefreshCw className="h-4 w-4 text-emerald-300" />
                  <span>Retries & recovery</span>
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-[11px] leading-7 text-slate-400">
                <p>
                  <span className="text-cyan-300">workflow</span> → validate
                  input
                </p>
                <p>
                  <span className="text-violet-300">workflow</span> → authorize
                  transition
                </p>
                <p>
                  <span className="text-emerald-300">workflow</span> → persist +
                  emit event
                </p>
                <p>
                  <span className="text-amber-300">worker</span> → integrate +
                  reconcile
                </p>
                <p>
                  <span className="text-slate-300">operator</span> → see the
                  next action
                </p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {content.platform.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs text-slate-300"
                  >
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="principles"
        className="mx-auto max-w-7xl px-5 py-24 md:py-32"
      >
        <SectionIntro
          eyebrow={principles.eyebrow}
          heading={principles.heading}
          description={principles.description}
        />
        <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {principleItems.map((item, index) => {
            const Icon = getCmsIcon(item.icon);
            return (
              <motion.article
                key={item.key}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                className="border-t border-slate-200 pt-5"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-[10px] font-semibold text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>
      <section id="process" className="bg-white px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow={engagement.eyebrow}
            heading={engagement.heading}
            description={engagement.description}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.key}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.07 }}
                className="relative rounded-2xl border border-slate-200 bg-[#f8fafc] p-5"
              >
                <span className="text-xs font-semibold text-blue-600">
                  0{index + 1}
                </span>
                <h3 className="mt-10 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 rounded-full bg-white text-slate-400 md:block" />
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
        <div className="contact-panel">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <p className="section-eyebrow text-cyan-300">
                {content.pricing.cardLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                {content.pricing.heading}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                {content.pricing.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-2">
                {[
                  "Industry",
                  "Current process",
                  "Expected users",
                  "Integrations",
                  "Timeline",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div id="contact">
              <ContactForm endpoint="/api/leads" />
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-white px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div>
              <a href="#top" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                  {content.navigation.logoText}
                </span>
                <span className="text-sm font-bold tracking-[0.2em]">
                  {content.footer.brandName}
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                {content.footer.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-slate-500">
              <a href="#work" className="hover:text-slate-950">
                Work
              </a>
              <a href="#capabilities" className="hover:text-slate-950">
                Capabilities
              </a>
              <a href="#domains" className="hover:text-slate-950">
                Industries
              </a>
              <a href="#engineering" className="hover:text-slate-950">
                Engineering
              </a>
              <a href="#process" className="hover:text-slate-950">
                Process
              </a>
              <a
                href={`mailto:${content.footer.email}`}
                className="hover:text-slate-950"
              >
                Email DHISOFT
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <span>
              © {new Date().getFullYear()} {content.footer.brandName}
            </span>
            <span>Real products. Clear scope. No invented outcomes.</span>
          </div>
        </div>
      </footer>
      {playing && (
        <VideoModal project={playing} onClose={() => setPlaying(null)} />
      )}
    </main>
  );
}
