
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Copy,
  Menu,
  Play,
  Search,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import ProjectMedia from "@/components/home/ProjectMedia";
import VideoModal from "@/components/home/VideoModal";
import { getCmsIcon } from "@/lib/icon-map";
import { activeSorted, type CmsProject, type HomeContent } from "@/types/cms";
import { defaultHomeContent } from "@/content/default-home-content";
import "./editorial-home.css";

type ProjectFilter = "All" | "Travel" | "Healthcare" | "SaaS" | "Finance";
const filters: ProjectFilter[] = ["All", "Travel", "Healthcare", "SaaS", "Finance"];
const projectPosterByKey: Record<string, string> = {
  "community-events": "/images/projects/community-events.jpg",
  "voya-vendor-platform": "/images/projects/voya-vendor-platform.jpg",
  "yes-we-care": "/images/projects/yes-we-care.jpg",
  "yes-we-care-admin": "/images/projects/yes-we-care-admin.jpg",
};

function projectPoster(project: CmsProject): string | undefined {
  return project.posterImage || projectPosterByKey[project.key];
}

function projectGroup(project: CmsProject): Exclude<ProjectFilter, "All"> {
  const description = `${project.key} ${project.slug} ${project.eyebrow} ${project.category}`.toLowerCase();
  if (/health|care|medical|\bhospital\b/.test(description)) return "Healthcare";
  if (/travel|hospitality|hotel|booking engine|voya|rainwood/.test(description)) return "Travel";
  if (/financial|mortgage|underwriting|fintech/.test(description)) return "Finance";
  return "SaaS";
}

function ProjectLinks({
  project,
  onPlay,
  onDetail,
  compact = false,
}: {
  project: CmsProject;
  onPlay: (project: CmsProject) => void;
  onDetail?: (project: CmsProject) => void;
  compact?: boolean;
}) {
  const canWatch = Boolean(project.videoUrl && project.videoSource !== "none");
  return (
    <div className={`ed-actions ${compact ? "ed-actions-compact" : ""}`}>
      {canWatch && (
        <button type="button" className="ed-btn ed-btn-primary" onClick={() => onPlay(project)}>
          <Play size={14} fill="currentColor" aria-hidden="true" /> Watch demo
        </button>
      )}
      {project.liveDemoUrl && (
        <a className="ed-btn ed-btn-dark" href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
          Live demo <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      {project.githubUrl && (
        <a className="ed-btn ed-btn-ghost" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      {project.caseStudyUrl && (
        <a className="ed-btn ed-btn-ghost" href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
          Case study <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      {onDetail && (
        <button type="button" className="ed-btn ed-btn-ghost" onClick={() => onDetail(project)}>
          Explore project <ChevronRight size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function ProjectArtwork({ project, onPlay }: { project: CmsProject; onPlay: (project: CmsProject) => void }) {
  const poster = projectPoster(project);
  const projectWithPoster = poster && poster !== project.posterImage ? { ...project, posterImage: poster } : project;
  return (
    <div className={`ed-artwork ed-artwork-${projectGroup(project).toLowerCase()}`}>
      <span className="ed-artwork-wash" aria-hidden="true" />
      <div className="ed-media-window">
        <ProjectMedia project={projectWithPoster} onPlay={onPlay} />
      </div>
    </div>
  );
}

function ProjectDetail({
  project,
  onClose,
  onPlay,
}: {
  project: CmsProject;
  onClose: () => void;
  onPlay: (project: CmsProject) => void;
}) {
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#project=${encodeURIComponent(project.slug)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyMessage("Project link copied");
    } catch {
      setCopyMessage(url);
    }
  };

  return (
    <div className="ed-detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="ed-detail" role="dialog" aria-modal="true" aria-label={`${project.title} project details`}>
        <button className="ed-icon-btn ed-detail-close" type="button" onClick={onClose} aria-label="Close project details">
          <X size={20} />
        </button>
        <h2>{project.title}</h2>
        <p className="ed-project-meta">{project.eyebrow} · {project.category}</p>
        <p className="ed-detail-lead">{project.shortDescription}</p>
        <ProjectArtwork project={project} onPlay={onPlay} />
        <p className="ed-detail-description">{project.description}</p>
        <div className="ed-detail-grid">
          <div><h3>Capabilities</h3><div className="ed-pills">{project.capabilities.map((item) => <span key={item} className="ed-pill">{item}</span>)}</div></div>
          <div><h3>Technology stack</h3><div className="ed-pills">{project.stack.length ? project.stack.map((item) => <span key={item} className="ed-pill">{item}</span>) : <span className="ed-no-data">Not specified in CMS</span>}</div></div>
          <div><h3>Project status</h3><p>{project.status}</p></div>
          <div><h3>Media</h3><p className="ed-break">{project.videoUrl || "No recording configured"}</p></div>
        </div>
        <ProjectLinks project={project} onPlay={onPlay} />
        <button type="button" className="ed-copy-link" onClick={() => void copyLink()}>
          <Copy size={14} /> Copy project link
        </button>
        {copyMessage && <p className="ed-copy-message" role="status">{copyMessage}</p>}
      </section>
    </div>
  );
}

function EditorialSectionIntro({ kicker: _kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="ed-section-heading">
      <div><h2>{title}</h2></div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default function EditorialHomePageClient({ content }: { content: HomeContent }) {
  const reduceMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("All");
  const [search, setSearch] = useState("");
 
const [selectedKey, setSelectedKey] = useState<string>(
  "voya-vendor-platform"
);

  const [detailProject, setDetailProject] = useState<CmsProject | null>(null);
  const [playing, setPlaying] = useState<CmsProject | null>(null);

  // All content and business rules continue to originate in the existing CMS.
  const portfolio = content.portfolio ?? defaultHomeContent.portfolio!;
  const domains = content.domains ?? defaultHomeContent.domains!;
  const principles = content.principles ?? defaultHomeContent.principles!;
  const engagement = content.engagement ?? defaultHomeContent.engagement!;
  const projects = useMemo(() => activeSorted(portfolio.projects), [portfolio.projects]);
  const visibleProjects = useMemo(() => projects.filter((project) => {
    if (selectedFilter !== "All" && projectGroup(project) !== selectedFilter) return false;
    const text = [project.title, project["eyebrow"], project.category, project.shortDescription, project.description, ...project.stack, ...project.capabilities].join(" ").toLowerCase();
    return text.includes(search.trim().toLowerCase());
  }), [projects, selectedFilter, search]);
  const selectedProject = visibleProjects.find((project) => project.key === selectedKey) ?? visibleProjects[0] ?? null;
  
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.replace(/^#project=/, ""));
    if (!window.location.hash.startsWith("#project=")) return;
    const initialProject = projects.find((project) => project.slug === slug);
    if (initialProject) setDetailProject(initialProject);
  }, [projects]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        if (!playing) setDetailProject(null);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [playing]);

  const openDetails = (project: CmsProject) => {
    setDetailProject(project);
    window.history.replaceState(null, "", `#project=${encodeURIComponent(project.slug)}`);
  };
  const closeDetails = () => {
    setDetailProject(null);
    if (window.location.hash.startsWith("#project=")) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  // CMS-managed navigation remains authoritative; editorial-only anchors are additions.
  const navLinks = [
    ...content.navigation.links,
    ...[
      { label: "Industries", href: "#domains" },
      { label: "Principles", href: "#principles" },
    ].filter((candidate) => !content.navigation.links.some((link) => link.href === candidate.href)),
  ];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>(".ed");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(
      ".ed-section-heading > div, .ed-section-heading > p, .ed-index-item, .ed-stage, .ed-info-card, .ed-domain-card, .ed-process-steps > li, .ed-pricing-card, .ed-contact-form, .ed-footer-grid > div"
    ));
    if (!root || !elements.length || !("IntersectionObserver" in window)) return;

    elements.forEach((element) => element.classList.add("ed-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
    root.classList.add("ed-motion-ready");
    return () => {
      observer.disconnect();
      root.classList.remove("ed-motion-ready");
    };
  }, []);

  return (
    <main className="ed" id="top">
      <div className="ed-topline" aria-hidden="true" />
      <header className="ed-header">
        <div className="ed-container ed-nav">
          <a className="ed-brand ed-brand-logo" href="#top" aria-label="DHISOFT homepage">
            <Image src="/images/dhisoft-logo.png" alt="DHISOFT" width={625} height={451} priority className="ed-header-logo-image" />
          </a>
          <nav id="primary-navigation" className={`ed-nav-links ${mobileNavOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMobileNavOpen(false)}>{link.label}</a>)}
          </nav>
          <a className="ed-btn ed-btn-dark ed-nav-cta" href={content.navigation.cta.href}>{content.navigation.cta.label} <ArrowUpRight size={14} /></a>
          <button type="button" className="ed-icon-btn ed-nav-toggle" onClick={() => setMobileNavOpen((value) => !value)} aria-controls="primary-navigation" aria-expanded={mobileNavOpen} aria-label={mobileNavOpen ? "Close menu" : "Open menu"}>
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section className="ed-hero">
        <div className="ed-container">
          <div className="ed-hero-grid">
            <div>
              <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {content.hero.titlePrefix} <em>{content.hero.titleHighlight}</em>
              </motion.h1>
              <p className="ed-hero-description">{content.hero.description}</p>
              <div className="ed-actions ed-hero-actions">
                <a className="ed-btn ed-btn-primary" href={content.hero.primaryCta.href}>{content.hero.primaryCta.label} <ArrowUpRight size={15} /></a>
                <a className="ed-btn ed-btn-ghost" href={content.hero.secondaryCta.href}>{content.hero.secondaryCta.label} <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </div>
          <div className="ed-hero-footnote"><span>Software for real operations</span><span>{projects.length} selected projects</span><a href="#work">Explore the work <ArrowRight size={14} aria-hidden="true" /></a></div>
        </div>
      </section>

      <div className="ed-audience"><div className="ed-container ed-audience-inner">{content.audiences.map((item) => <span key={item}>{item}</span>)}</div></div>

      <section id="work" className="ed-section ed-work">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 01 / ${portfolio.eyebrow}`} title={portfolio.heading} text={portfolio.description} />
          <div className="ed-work-tools">
            <div className="ed-filters" role="group" aria-label="Filter projects">
              {filters.map((filter) => <button key={filter} type="button" aria-pressed={selectedFilter === filter} onClick={() => setSelectedFilter(filter)}>{filter}</button>)}
            </div>
            <label className="ed-search"><Search size={16} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the work" aria-label="Search projects" /></label>
          </div>
          <div className="ed-work-meta"><span>Choose a project to see its story</span><span role="status" aria-live="polite">{visibleProjects.length} of {projects.length} projects</span></div>
          <div className="ed-explorer">
            <div className="ed-project-index" aria-label="Project index">
              {visibleProjects.length ? visibleProjects.map((project) => { const poster = projectPoster(project); return <button key={project.key} className={`ed-index-item ${poster ? "has-poster" : ""} ${selectedProject?.key === project.key ? "is-selected" : ""}`} type="button" onClick={() => setSelectedKey(project.key)} aria-pressed={selectedProject?.key === project.key}>
                {poster && <span className="ed-index-thumb" aria-hidden="true"><Image src={poster} alt="" width={104} height={78} /></span>}
                <span><strong>{project.title}</strong><small>{projectGroup(project)} / {project.category}</small></span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>; }) : <p className="ed-empty">No matching projects. Clear your search or choose another category.</p>}
            </div>
            <div className="ed-stage">
              {selectedProject ? <>
                <div className="ed-stage-top"><span>{selectedProject.eyebrow}</span><span>{selectedProject.status}</span></div>
                <ProjectArtwork project={selectedProject} onPlay={setPlaying} />
                <div className="ed-stage-bottom"><div><h3>{selectedProject.title}</h3><p>{selectedProject.shortDescription}</p></div><ProjectLinks project={selectedProject} onPlay={setPlaying} onDetail={openDetails} compact /></div>

<div className="ed-stage-extra">
  <p>{selectedProject.description}</p>

  <div className="ed-pills">
    {[...selectedProject.capabilities, ...selectedProject.stack].map(
      (item) => (
        <span key={item} className="ed-pill">
          {item}
        </span>
      )
    )}
  </div>

  {selectedProject.liveDemoUrl && (
    <p style={{ marginTop: "16px" }}>
      <strong>Live Demo: </strong>
      <a
        href={selectedProject.liveDemoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#c34d35",
          fontWeight: 700,
          textDecoration: "underline",
          overflowWrap: "anywhere",
        }}
      >
        {selectedProject.liveDemoUrl}
      </a>
    </p>
  )}
</div>

              </> : <p className="ed-empty">Choose another category to view projects.</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="ed-section ed-practice">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 02 / ${content.products.eyebrow}`} title={content.products.heading} text="Product engineering that respects the operational logic beneath every screen." />
          <div className="ed-cards ed-cards-four">
            {activeSorted(content.products.items).map((item) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><Icon size={23} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}
          </div>
          <div className="ed-subsection-heading"><h3>From idea to operation</h3><span>THREE CORE CAPABILITIES</span></div>
          <div className="ed-cards ed-cards-three">
            {activeSorted(content.capabilities.items).map((item) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><Icon size={23} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}
          </div>
        </div>
      </section>

      <section id="domains" className="ed-section">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 03 / ${domains.eyebrow}`} title={domains.heading} text="Domain-specific workflows demand thoughtful technical choices." />
          <div className="ed-cards ed-domains-grid">
            {activeSorted(domains.items).map((item) => <article key={item.key} className="ed-domain-card"><h3>{item.title}</h3><p>{item.description}</p><div className="ed-pills">{item.items.map((label) => <span key={label} className="ed-pill">{label}</span>)}</div></article>)}
          </div>
        </div>
      </section>

      <section id="engineering" className="ed-section ed-engineering">
        <div className="ed-container ed-engineering-grid"><div><h2>{content.platform.heading}</h2><p>{content.platform.description}</p><div className="ed-engineering-features">{content.platform.features.map((item) => <div key={item}><ArrowUpRight size={15} />{item}</div>)}</div></div></div>
      </section>

      <section id="principles" className="ed-section">
        <div className="ed-container"><EditorialSectionIntro kicker={principles.eyebrow} title={principles.heading} text={principles.description} /><div className="ed-cards ed-cards-three">{activeSorted(principles.items).map((item) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><Icon size={23} /><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div>
      </section>

      <section id="process" className="ed-section ed-process">
        <div className="ed-container"><EditorialSectionIntro kicker={engagement.eyebrow} title={engagement.heading} text={engagement.description} /><ol className="ed-process-steps">{activeSorted(engagement.steps).map((item) => <li key={item.key}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></div>
      </section>

      <section id="pricing" className="ed-section">
        <div className="ed-container ed-pricing-grid"><div><h2>{content.pricing.heading}</h2><p>{content.pricing.description}</p><a className="ed-btn ed-btn-primary" href={content.pricing.cta.href}>{content.pricing.cta.label}<ArrowRight size={15} /></a></div><div className="ed-pricing-card"><h3>{content.pricing.priceText}</h3><p>{content.pricing.cardDescription}</p><div className="ed-pills">{["Real users", "Clear constraints", "Useful milestones"].map((item) => <span key={item} className="ed-pill">{item}</span>)}</div></div></div>
      </section>

      <section id="contact" className="ed-section ed-contact"><div className="ed-container ed-contact-grid"><div><h2>Make something <em>matter.</em></h2><p>Tell us about the workflow, the users, and the problem you&apos;re trying to make simpler.</p><a className="ed-btn ed-btn-ghost" href={`mailto:${content.footer.email}`}>{content.footer.email}<ArrowUpRight size={14} /></a></div><div className="ed-contact-form"><ContactForm endpoint="/api/leads" /></div></div></section>

      <footer className="ed-footer"><div className="ed-container"><div className="ed-footer-grid"><div>
      
<a className="ed-brand ed-brand-logo ed-footer-brand-logo" href="#top" aria-label="DHISOFT homepage">
  <Image src="/images/dhisoft-logo.png" alt="DHISOFT" width={625} height={451} />
</a>

<p>{content.footer.description}</p></div><div><h2>Explore</h2>{[{ label: "Selected work", href: "#work" }, { label: "What we build", href: "#capabilities" }, { label: "Industries", href: "#domains" }, { label: "Engineering", href: "#engineering" }, { label: "Process", href: "#process" }].map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div><div><h2>Contact</h2><a href="https://github.com/dvilabsai-copilot/dhisoft" target="_blank" rel="noopener noreferrer">GitHub repository ↗</a><a href={`mailto:${content.footer.email}`}>Email DHISOFT ↗</a><a href="#contact">Start a project ↗</a></div></div><div className="ed-footer-bottom"><span>© {new Date().getFullYear()} {content.footer.brandName}</span><span>Real products. Clear scope. No invented outcomes.</span></div></div></footer>

      {detailProject && <ProjectDetail key={detailProject.key} project={detailProject} onClose={closeDetails} onPlay={setPlaying} />}
      {playing && <VideoModal project={playing} onClose={() => setPlaying(null)} />}
    </main>
  );
}
