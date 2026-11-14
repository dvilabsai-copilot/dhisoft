"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import "./hero-concepts.css";

const services = [
  { label: "Launch a product", title: "From idea to launch.", description: "Shape the product, design the experience, and build the frontend, backend and delivery pipeline together.", outputs: ["Product strategy", "UX & UI design", "Full-stack development"] },
  { label: "Simplify operations", title: "Less friction. More flow.", description: "Turn spreadsheets, approvals and disconnected tools into one workflow built around the way your business operates.", outputs: ["Workflow mapping", "Business automation", "Operational dashboards"] },
  { label: "Connect your systems", title: "Make it work together.", description: "Connect your products, data and external services through dependable APIs, integrations and background processes.", outputs: ["API development", "Systems integration", "Cloud delivery"] },
];

function BrandNav({ dark = false }: { dark?: boolean }) {
  return <nav className={`hc-nav ${dark ? "hc-nav-dark" : ""}`} aria-label="Template navigation">
    <a href="/" className="hc-brand" aria-label="DHISOFT homepage"><span className="hc-brand-name">dhi<span>soft</span></span><span className="hc-brand-caption">Product engineering studio</span></a>
    <div className="hc-nav-links"><a href="/#work">Our work</a><a href="/#capabilities">Expertise</a><a href="/#process">How we work</a></div>
    <a className="hc-nav-action" href="/#contact">Let’s talk <ArrowUpRight size={16} /></a>
  </nav>;
}

function Actions() {
  return <div className="hc-actions"><a href="/#contact" className="hc-button">Discuss your project <ArrowUpRight size={18} /></a>
    <a href="/#capabilities" className="hc-text-action">Explore our expertise <ArrowRight size={18} /></a>
  </div>;
}

export default function HeroConcepts() {
  const [phone, setPhone] = useState(false);
  const [selectedService, setSelectedService] = useState(0);
  const service = services[selectedService];

  return <main className="hc-gallery">
    <header className="hc-gallery-heading">
      <a href="/" className="hc-back">DHISOFT <ArrowUpRight size={16} /></a>
      <h1>Three ways to say hello.</h1>
      <p>Three hero directions built around DHISOFT’s services, approach and brand. Project showcases belong in the portfolio section below.</p>
      <div className="hc-gallery-controls">
        <nav aria-label="Jump to hero concept"><a href="#product-focus">Clear direction</a><a href="#dark-reel">Engineering partner</a><a href="#blue-studio">Blue studio</a></nav>
        <div className="hc-device" role="group" aria-label="Preview width">
          <button type="button" aria-pressed={!phone} onClick={() => setPhone(false)}><Monitor size={17} />Desktop</button>
          <button type="button" aria-pressed={phone} onClick={() => setPhone(true)}><Smartphone size={17} />Phone</button>
        </div>
      </div>
    </header>

    <section id="product-focus" className="hc-concept" aria-labelledby="product-focus-title">
      <div className="hc-concept-note"><div><h2 id="product-focus-title">Clear direction</h2><p>A light, balanced introduction. The headline explains the value; the service map shows how you deliver it.</p></div></div>
      <div className={`hc-preview ${phone ? "hc-phone" : ""}`}><div className="hc-template hc-light">
        <BrandNav />
        <div className="hc-product-layout">
          <div className="hc-copy"><h2>Complex work.<br />Clear software.</h2><p>We turn business workflows into software people can actually use. One team for design, engineering and the operations behind your product.</p><Actions /><div className="hc-disciplines"><span>SaaS platforms</span><span>Business automation</span><span>APIs & integrations</span></div></div>
          <div className="hc-service-map" aria-label="Our delivery approach"><p className="hc-map-intro">From the first question<br />to a working system.</p><ol>{[{ title: "Understand", text: "Your users, your workflow, your next milestone." }, { title: "Design & build", text: "A clear interface. A dependable system underneath." }, { title: "Launch & evolve", text: "Delivery, visibility and a path to what comes next." }].map((step) => <li key={step.title}><div><h3>{step.title}</h3><p>{step.text}</p></div><ArrowRight size={22} aria-hidden="true" /></li>)}</ol></div>
        </div>
        <div className="hc-bottomline"><span>Software built around your business.</span><a href="/#process">See how we work <ArrowRight size={16} /></a></div>
      </div></div>
    </section>

    <section id="dark-reel" className="hc-concept" aria-labelledby="dark-reel-title">
      <div className="hc-concept-note"><div><h2 id="dark-reel-title">Engineering partner</h2><p>A dark, focused introduction with a service selector. Visitors can start with the problem they need to solve.</p></div></div>
      <div className={`hc-preview ${phone ? "hc-phone" : ""}`}><div className="hc-template hc-dark">
        <BrandNav dark />
        <div className="hc-reel-copy"><h2>Built for what’s next.</h2><p>A software engineering partner for your next product,<br />your everyday operations, and the systems connecting them.</p><Actions /></div>
        <div className="hc-service-selector"><div className="hc-service-tabs" role="group" aria-label="What do you want to build?">{services.map((item, index) => <button key={item.label} type="button" aria-pressed={selectedService === index} onClick={() => setSelectedService(index)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></button>)}</div><div className="hc-service-answer" aria-live="polite" aria-atomic="true"><div><h3>{service.title}</h3><p>{service.description}</p></div><ul>{service.outputs.map((output) => <li key={output}>{output}</li>)}</ul></div></div>
        <div className="hc-bottomline"><span>From interface to infrastructure.</span><a href="/#capabilities">Our capabilities <ArrowRight size={16} /></a></div>
      </div></div>
    </section>

    <section id="blue-studio" className="hc-concept" aria-labelledby="blue-studio-title">
      <div className="hc-concept-note"><div><h2 id="blue-studio-title">Blue studio</h2><p>My recommendation: a bold brand statement, one clear next step and a concise introduction to your expertise.</p></div></div>
      <div className={`hc-preview ${phone ? "hc-phone" : ""}`}><div className="hc-template hc-blue">
        <BrandNav dark />
        <div className="hc-studio-copy"><h2>Big ideas.<br />Working software.</h2><div><p>A product engineering partner for the systems your business runs on. We connect thoughtful design with the engineering underneath.</p><Actions /></div></div>
        <div className="hc-expertise-strip">{[{ title: "Product design", text: "Make the complex feel clear. Research, workflows and interfaces built around people." }, { title: "Software engineering", text: "Bring the whole system together. Frontend, backend, integrations and automation." }, { title: "Cloud & delivery", text: "Move from build to business. Deployment, monitoring and a reliable path forward." }].map((item) => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
        <div className="hc-bottomline"><span>Design. Build. Launch. Evolve.</span><a href="/#work">See all work <ArrowRight size={16} /></a></div>
      </div></div>
    </section>
    <footer className="hc-gallery-footer"><p>These hero concepts introduce the company. Your project recordings and demos are shown once, in the dedicated portfolio section below the chosen hero.</p><a href="/#work">View the portfolio section <ArrowUpRight size={16} /></a></footer>
  </main>;
}
