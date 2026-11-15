import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ServicePageContent } from "@/content/service-pages";
import { aboutDhi, servicePages, travelIndustry } from "@/content/service-pages";
import ContactForm from "@/components/contact/ContactForm";
import SiteMotion from "@/components/home/SiteMotion";
import "./editorial-home.css";

function SiteHeader() {
  return <header className="ed-header"><div className="ed-container ed-nav">
    <Link className="ed-brand ed-brand-logo" href="/" aria-label="DHISOFT homepage"><Image src="/images/dhisoft-logo.png" alt="DHISOFT" width={625} height={451} priority /></Link>
    <nav className="ed-sub-nav" aria-label="Primary navigation"><Link href="/#work">Work</Link><Link href="/services">Services</Link><Link href="/industries/travel-hospitality">Travel & hospitality</Link><Link href="/about">About</Link></nav>
    <details className="ed-sub-mobile-nav"><summary>Menu</summary><nav aria-label="Mobile navigation"><Link href="/#work">Work</Link><Link href="/services">Services</Link><Link href="/industries/travel-hospitality">Travel & hospitality</Link><Link href="/about">About</Link></nav></details>
    <Link className="ed-btn ed-btn-dark ed-nav-cta" href="/#contact">Discuss your project <ArrowUpRight size={14} aria-hidden="true" /></Link>
  </div></header>;
}

function SiteFooter() {
  return <footer className="ed-footer"><div className="ed-container ed-footer-grid">
    <div><Link className="ed-brand ed-brand-logo" href="/" aria-label="DHISOFT homepage"><Image src="/images/dhisoft-logo.png" alt="DHISOFT" width={625} height={451} /></Link><p>Custom software, SaaS products and operational systems shaped around real work.</p></div>
    <div><h2>Explore</h2><Link href="/services">Services</Link><Link href="/industries/travel-hospitality">Travel & hospitality</Link><Link href="/#work">Selected work</Link><Link href="/about">About DHI</Link></div>
    <div><h2>Talk to us</h2><a href="mailto:info@dhisoft.in">info@dhisoft.in</a><a href="tel:+917207160372">+91 7207160372</a><Link href="/#contact">Start a project <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
  </div><div className="ed-container ed-footer-wordmark ed-reveal" aria-hidden="true">DHISOFT</div><div className="ed-container ed-footer-bottom"><span>© {new Date().getFullYear()} DHI Software Systems Private Limited</span><Link href="/">DHISOFT homepage</Link></div></footer>;
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return <main className="ed ed-subpage"><SiteMotion /><a className="ed-skip" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /></main>;
}

function ContactCallout() {
  return <section className="ed-sub-contact" id="contact"><div className="ed-container ed-sub-contact-grid"><div><h2>Tell us what needs to work better.</h2><p>Share the workflow, the people involved and what is getting in the way. We’ll start with the problem and work out a sensible next step.</p><a className="ed-sub-email" href="mailto:info@dhisoft.in">info@dhisoft.in <ArrowUpRight size={16} aria-hidden="true" /></a></div><ContactForm endpoint="/api/leads" /></div></section>;
}

const portfolioSlugByTitle: Record<string, string> = {
  "Rural Skill & Livelihood OS": "rural-skill-os",
  "RainWood Direct Booking Engine": "rainwood",
  "Community Events SaaS": "community-events",
  "Travel OS": "travel-os",
  "Mortgage UWA": "mortgage-uwa",
  "VOYA Vendor Platform": "voya-vendor-platform",
  "Yes We Care": "yes-we-care",
  "Yes We Care Admin Panel": "yes-we-care-admin",
};

function portfolioHref(title: string) {
  const slug = portfolioSlugByTitle[title];
  return slug ? `/#project=${encodeURIComponent(slug)}` : "/#work";
}

export function ServicesLandingPage() {
  return <PageFrame><div id="main-content" className="ed-sub-main">
    <section className="ed-sub-hero"><div className="ed-container"><Link className="ed-back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> DHISOFT</Link><h1>Software for the work behind the screen.</h1><p>From a new SaaS product to a workflow that needs untangling, we connect product thinking with the engineering that makes it useful.</p><Link className="ed-btn ed-btn-dark" href="/#contact">Discuss your project <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section>
    <section className="ed-sub-section ed-services-list"><div className="ed-container"><h2>Ways we can help</h2><div className="ed-service-links">{servicePages.map((service) => <ServiceLink key={service.slug} service={service} />)}</div></div></section>
    <ContactCallout />
  </div></PageFrame>;
}

function ServiceLink({ service }: { service: ServicePageContent }) {
  return <Link href={`/services/${service.slug}`} className="ed-service-link"><span><strong>{service.title}</strong><small>{service.summary}</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link>;
}

export function ServiceDetailPage({ service }: { service: ServicePageContent }) {
  return <PageFrame><div id="main-content" className="ed-sub-main">
    <section className="ed-sub-hero"><div className="ed-container"><Link className="ed-back-link" href="/services"><ArrowLeft size={15} aria-hidden="true" /> All services</Link><h1>{service.title}</h1><p>{service.summary}</p><Link className="ed-btn ed-btn-dark" href="/#contact">Discuss your project <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section>
    <section className="ed-sub-section"><div className="ed-container ed-service-story"><div><h2>The problem</h2><p>{service.problem}</p><h2>How we approach it</h2><p>{service.approach}</p></div><div><h2>What we can build</h2><ul>{service.solution.map((item) => <li key={item}>{item}</li>)}</ul><h2>Common use cases</h2><ul>{service.useCases.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    {service.relatedWork.length > 0 && <section className="ed-sub-work"><div className="ed-container"><h2>Related work in the portfolio</h2><p>Explore the systems and demos already represented in the DHISOFT portfolio.</p><div className="ed-sub-project-links">{service.relatedWork.map((name) => <Link key={name} href={portfolioHref(name)}>{name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div></div></section>}
    <section className="ed-sub-section ed-sub-back"><div className="ed-container"><Link href="/services"><ArrowLeft size={15} aria-hidden="true" /> Browse all services</Link></div></section>
    <ContactCallout />
  </div></PageFrame>;
}

export function TravelIndustryPage() {
  return <PageFrame><div id="main-content" className="ed-sub-main">
    <section className="ed-sub-hero ed-travel-hero"><div className="ed-container"><Link className="ed-back-link" href="/services"><ArrowLeft size={15} aria-hidden="true" /> Services</Link><h1>{travelIndustry.title}</h1><p>{travelIndustry.summary}</p><Link className="ed-btn ed-btn-dark" href="/#contact">Discuss a travel product <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section>
    <section className="ed-sub-section"><div className="ed-container ed-service-story"><div><h2>One journey. Many connected steps.</h2><p>{travelIndustry.problem}</p><h2>Designed around the booking lifecycle</h2><p>{travelIndustry.approach}</p></div><div><h2>Travel product capabilities</h2><ul>{travelIndustry.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    <section className="ed-sub-work"><div className="ed-container"><h2>Relevant portfolio systems</h2><p>These examples describe systems in the portfolio. Follow each to view its available demo and project details.</p><div className="ed-sub-project-links">{travelIndustry.work.map((name) => <Link key={name} href={portfolioHref(name)}>{name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div></div></section>
    <ContactCallout />
  </div></PageFrame>;
}

export function AboutPage() {
  return <PageFrame><div id="main-content" className="ed-sub-main">
    <section className="ed-sub-hero"><div className="ed-container"><Link className="ed-back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> DHISOFT</Link><h1>{aboutDhi.title}</h1><p>{aboutDhi.summary}</p></div></section>
    <section className="ed-sub-section"><div className="ed-container ed-about-copy"><p className="ed-about-lead">{aboutDhi.description}</p><h2>How we think about engineering</h2><ul>{aboutDhi.principles.map((item) => <li key={item}>{item}</li>)}</ul><Link className="ed-btn ed-btn-dark" href="/#work">Explore selected work <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section>
    <ContactCallout />
  </div></PageFrame>;
}
