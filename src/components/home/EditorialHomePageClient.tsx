
"use client";

import { useEffect, useMemo, useState } from "react";
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
import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import ProductPreview from "@/components/home/ProductPreview";
import ProjectMedia from "@/components/home/ProjectMedia";
import VideoModal from "@/components/home/VideoModal";
import { getCmsIcon } from "@/lib/icon-map";
import { activeSorted, type CmsProject, type HomeContent } from "@/types/cms";
import { defaultHomeContent } from "@/content/default-home-content";
import "./editorial-home.css";

type ProjectFilter = "All" | "Travel" | "Healthcare" | "SaaS" | "Finance";
const filters: ProjectFilter[] = ["All", "Travel", "Healthcare", "SaaS", "Finance"];

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
  return (
    <div className={`ed-artwork ed-artwork-${projectGroup(project).toLowerCase()}`}>
      <span className="ed-artwork-wash" aria-hidden="true" />
      <div className="ed-media-window">
        <ProjectMedia project={project} onPlay={onPlay} />
      </div>
      <div className="ed-artwork-caption">
        <span>PRODUCT SURFACE / {project.eyebrow}</span>
        <span>{project.videoSource === "mp4" ? "RECORDED WALKTHROUGH" : "PROJECT PREVIEW"}</span>
      </div>
    </div>
  );
}

function ProjectDetail({
  project,
  index,
  total,
  onClose,
  onPlay,
}: {
  project: CmsProject;
  index: number;
  total: number;
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
        <div className="ed-project-eyebrow">
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <span>{project.eyebrow} · {project.category}</span>
        </div>
        <h2>{project.title}</h2>
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

function EditorialSectionIntro({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="ed-section-heading">
      <div><span className="ed-kicker">{kicker}</span><h2>{title}</h2></div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default function EditorialHomePageClient({ content }: { content: HomeContent }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>("");
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
    const text = [project.title, project.eyebrow, project.category, project.shortDescription, project.description, ...project.stack, ...project.capabilities].join(" ").toLowerCase();
    return text.includes(search.trim().toLowerCase());
  }), [projects, selectedFilter, search]);
  const selectedProject = visibleProjects.find((project) => project.key === selectedKey) ?? visibleProjects[0] ?? null;
  const featured = projects.find((project) => project.featured) ?? projects[0];

  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.replace(/^#project=/, ""));
    if (!window.location.hash.startsWith("#project=")) return;
    const initialProject = projects.find((project) => project.slug === slug);
    if (initialProject) setDetailProject(initialProject);
  }, [projects]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !playing) setDetailProject(null);
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

  const projectIndex = (project: CmsProject) => projects.findIndex((item) => item.key === project.key);
  // CMS-managed navigation remains authoritative; editorial-only anchors are additions.
  const navLinks = [
    ...content.navigation.links,
    ...[
      { label: "Industries", href: "#domains" },
      { label: "Principles", href: "#principles" },
    ].filter((candidate) => !content.navigation.links.some((link) => link.href === candidate.href)),
  ];

  return (
    <main className="ed" id="top">
      <div className="ed-topline" aria-hidden="true" />
      <header className="ed-header">
        <div className="ed-container ed-nav">
          <a className="ed-brand" href="#top" aria-label="DHISOFT homepage">
            {content.navigation.brandName}<b>.</b>
            <small>PRODUCTS / PLATFORMS / SYSTEMS</small>
          </a>
          <nav className={`ed-nav-links ${mobileNavOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMobileNavOpen(false)}>{link.label}</a>)}
          </nav>
          <a className="ed-btn ed-btn-dark ed-nav-cta" href={content.navigation.cta.href}>{content.navigation.cta.label} <ArrowUpRight size={14} /></a>
          <button type="button" className="ed-icon-btn ed-nav-toggle" onClick={() => setMobileNavOpen((value) => !value)} aria-expanded={mobileNavOpen} aria-label={mobileNavOpen ? "Close menu" : "Open menu"}>
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section className="ed-hero">
        <div className="ed-container">
          <div className="ed-hero-grid">
            <div>
              <span className="ed-kicker">{content.hero.badge}</span>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {content.hero.titlePrefix} <em>{content.hero.titleHighlight}</em>
              </motion.h1>
              <p className="ed-hero-description">{content.hero.description}</p>
              <div className="ed-actions ed-hero-actions">
                <a className="ed-btn ed-btn-primary" href={content.hero.primaryCta.href}>{content.hero.primaryCta.label} <ArrowUpRight size={15} /></a>
                <a className="ed-btn ed-btn-ghost" href={content.hero.secondaryCta.href}>{content.hero.secondaryCta.label} <ArrowUpRight size={15} /></a>
              </div>
            </div>
            <div className="ed-hero-feature">
              <div className="ed-hero-feature-top"><span>DHISOFT / FIELD NOTES / FEATURED BUILD</span><span>↗</span></div>
              {featured && <><div className="ed-hero-preview"><ProductPreview project={featured} /></div><div className="ed-hero-feature-bottom"><div><span>FEATURED PRODUCT</span><strong>{featured.title}</strong></div><button type="button" onClick={() => openDetails(featured)} aria-label={`Explore ${featured.title}`}><ArrowUpRight size={18} /></button></div></>}
            </div>
          </div>
          <div className="ed-hero-footnote"><span>Multi-domain thinking</span><span>{String(projects.length).padStart(2, "0")} / SELECTED PRODUCTS</span><span>Scroll to explore ↓</span></div>
        </div>
      </section>

      <div className="ed-audience"><div className="ed-container ed-audience-inner">{content.audiences.map((item) => <span key={item}>{item}</span>)}</div></div>

      <section id="work" className="ed-section ed-work">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 01 / ${portfolio.eyebrow}`} title={portfolio.heading} text={portfolio.description} />
          <div className="ed-work-tools">
            <div className="ed-filters" aria-label="Filter projects">
              {filters.map((filter) => <button key={filter} type="button" aria-pressed={selectedFilter === filter} onClick={() => setSelectedFilter(filter)}>{filter}</button>)}
            </div>
            <label className="ed-search"><Search size={16} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the work" aria-label="Search projects" /></label>
          </div>
          <div className="ed-work-meta"><span>CHOOSE A PROJECT TO EXPLORE ITS STORY</span><span>{String(visibleProjects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} PROJECTS</span></div>
          <div className="ed-explorer">
            <div className="ed-project-index" aria-label="Project index">
              {visibleProjects.length ? visibleProjects.map((project) => <button key={project.key} className={`ed-index-item ${selectedProject?.key === project.key ? "is-selected" : ""}`} type="button" onClick={() => setSelectedKey(project.key)} aria-pressed={selectedProject?.key === project.key}>
                <span className="ed-index-number">{String(projectIndex(project) + 1).padStart(2, "0")}</span>
                <span><strong>{project.title}</strong><small>{projectGroup(project)} / {project.category}</small></span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>) : <p className="ed-empty">No matching projects. Clear your search or choose another category.</p>}
            </div>
            <div className="ed-stage">
              {selectedProject ? <>
                <div className="ed-stage-top"><span>PROJECT {String(projectIndex(selectedProject) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {selectedProject.eyebrow}</span><span>{selectedProject.status}</span></div>
                <ProjectArtwork project={selectedProject} onPlay={setPlaying} />
                <div className="ed-stage-bottom"><div><h3>{selectedProject.title}</h3><p>{selectedProject.shortDescription}</p></div><ProjectLinks project={selectedProject} onPlay={setPlaying} onDetail={openDetails} compact /></div>
                <div className="ed-stage-extra"><p>{selectedProject.description}</p><div className="ed-pills">{[...selectedProject.capabilities, ...selectedProject.stack].map((item) => <span key={item} className="ed-pill">{item}</span>)}</div></div>
              </> : <p className="ed-empty">Choose another category to view projects.</p>}
            </div>
          </div>
          <div className="ed-gallery-head"><div><span className="ed-kicker">EXPLORE ALL CASES</span><h3>Every project, every angle.</h3></div><span>{String(visibleProjects.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></div>
          <div className="ed-gallery">
            {visibleProjects.map((project) => <article key={project.key} className="ed-gallery-card">
              <div className="ed-gallery-meta"><span>{String(projectIndex(project) + 1).padStart(2, "0")} / {project.eyebrow}</span><span>{project.status}</span></div>
              <ProjectArtwork project={project} onPlay={setPlaying} />
              <h3>{project.title}</h3>
              <p className="ed-gallery-lead">{project.shortDescription}</p>
              <p>{project.description}</p>
              <div className="ed-pills">{project.capabilities.map((item) => <span key={item} className="ed-pill">{item}</span>)}{project.stack.map((item) => <span key={`tech-${item}`} className="ed-pill">{item}</span>)}</div>
              <ProjectLinks project={project} onPlay={setPlaying} onDetail={openDetails} compact />
            </article>)}
          </div>
        </div>
      </section>

      <section id="capabilities" className="ed-section ed-practice">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 02 / ${content.products.eyebrow}`} title={content.products.heading} text="Product engineering that respects the operational logic beneath every screen." />
          <div className="ed-cards ed-cards-four">
            {activeSorted(content.products.items).map((item, index) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><div className="ed-card-count">{String(index + 1).padStart(2, "0")} / WHAT WE BUILD</div><Icon size={23} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}
          </div>
          <div className="ed-subsection-heading"><h3>From idea to operation</h3><span>THREE CORE CAPABILITIES</span></div>
          <div className="ed-cards ed-cards-three">
            {activeSorted(content.capabilities.items).map((item, index) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><div className="ed-card-count">{String(index + 1).padStart(2, "0")} / WORKSTREAM</div><Icon size={23} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}
          </div>
        </div>
      </section>

      <section id="domains" className="ed-section">
        <div className="ed-container">
          <EditorialSectionIntro kicker={`INDEX 03 / ${domains.eyebrow}`} title={domains.heading} text="Domain-specific workflows demand thoughtful technical choices." />
          <div className="ed-cards ed-domains-grid">
            {activeSorted(domains.items).map((item, index) => <article key={item.key} className="ed-domain-card"><span className="ed-card-count">{String(index + 1).padStart(2, "0")} / OPERATING ENVIRONMENT</span><h3>{item.title}</h3><p>{item.description}</p><div className="ed-pills">{item.items.map((label) => <span key={label} className="ed-pill">{label}</span>)}</div></article>)}
          </div>
        </div>
      </section>

      <section id="engineering" className="ed-section ed-engineering">
        <div className="ed-container ed-engineering-grid"><div><span className="ed-kicker">INDEX 04 / {content.platform.eyebrow}</span><h2>{content.platform.heading}</h2><p>{content.platform.description}</p><div className="ed-engineering-features">{content.platform.features.map((item) => <div key={item}><ArrowUpRight size={15} />{item}</div>)}</div></div><div className="ed-engineering-orbit"><div className="ed-engineering-center">Design<br />↓<br />Delivery</div><span className="ed-orbit-label ed-orbit-label-one">INTEGRATED SYSTEMS</span><span className="ed-orbit-label ed-orbit-label-two">BUILT TO LAST ↗</span></div></div>
      </section>

      <section id="principles" className="ed-section">
        <div className="ed-container"><EditorialSectionIntro kicker={`INDEX 05 / ${principles.eyebrow}`} title={principles.heading} text={principles.description} /><div className="ed-cards ed-cards-three">{activeSorted(principles.items).map((item, index) => { const Icon = getCmsIcon(item.icon); return <article key={item.key} className="ed-info-card"><span className="ed-card-count">{String(index + 1).padStart(2, "0")} / PRINCIPLE</span><Icon size={23} /><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div>
      </section>

      <section id="process" className="ed-section ed-process">
        <div className="ed-container"><EditorialSectionIntro kicker={`INDEX 06 / ${engagement.eyebrow}`} title={engagement.heading} text={engagement.description} /><div className="ed-process-steps">{activeSorted(engagement.steps).map((item, index) => <article key={item.key}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div>
      </section>

      <section id="pricing" className="ed-section">
        <div className="ed-container ed-pricing-grid"><div><span className="ed-kicker">INDEX 07 / COLLABORATE</span><h2>{content.pricing.heading}</h2><p>{content.pricing.description}</p><a className="ed-btn ed-btn-primary" href={content.pricing.cta.href}>{content.pricing.cta.label}<ArrowRight size={15} /></a></div><div className="ed-pricing-card"><span className="ed-kicker">{content.pricing.cardLabel}</span><h3>{content.pricing.priceText}</h3><p>{content.pricing.cardDescription}</p><div className="ed-pills">{["Real users", "Clear constraints", "Useful milestones"].map((item) => <span key={item} className="ed-pill">{item}</span>)}</div></div></div>
      </section>

      <section id="contact" className="ed-section ed-contact"><div className="ed-container ed-contact-grid"><div><span className="ed-kicker">INDEX 08 / OPEN A CONVERSATION</span><h2>Make something <em>matter.</em></h2><p>Tell us about the workflow, the users, and the problem you&apos;re trying to make simpler.</p><a className="ed-btn ed-btn-ghost" href={`mailto:${content.footer.email}`}>{content.footer.email}<ArrowUpRight size={14} /></a></div><div className="ed-contact-form"><ContactForm endpoint="/api/leads" /></div></div></section>

      <footer className="ed-footer"><div className="ed-container"><div className="ed-footer-grid"><div><a className="ed-brand" href="#top">{content.footer.brandName}<b>.</b></a><p>{content.footer.description}</p></div><div><span className="ed-kicker">EXPLORE</span>{[{ label: "Selected work", href: "#work" }, { label: "What we build", href: "#capabilities" }, { label: "Industries", href: "#domains" }, { label: "Engineering", href: "#engineering" }, { label: "Process", href: "#process" }].map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div><div><span className="ed-kicker">ELSEWHERE</span><a href="https://github.com/dvilabsai-copilot/dhisoft" target="_blank" rel="noopener noreferrer">GitHub repository ↗</a><a href={`mailto:${content.footer.email}`}>Email DHISOFT ↗</a><a href="#contact">Start a project ↗</a></div></div><div className="ed-footer-bottom"><span>© {new Date().getFullYear()} {content.footer.brandName}</span><span>Real products. Clear scope. No invented outcomes.</span></div></div></footer>

      {detailProject && <ProjectDetail key={detailProject.key} project={detailProject} index={projectIndex(detailProject)} total={projects.length} onClose={closeDetails} onPlay={setPlaying} />}
      {playing && <VideoModal project={playing} onClose={() => setPlaying(null)} />}
    </main>
  );
}
