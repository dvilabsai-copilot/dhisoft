"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

const technologyGroups = [
  {
    id: "frontend",
    label: "Frontend",
    heading: "Frontend engineering",
    description: "Customer-facing websites, booking flows and dashboards built for desktop and mobile.",
    tools: [
      { logo: "react", name: "React", use: "Reusable interfaces" },
      { logo: "nextjs", name: "Next.js", use: "Web applications" },
      { logo: "typescript", name: "TypeScript", use: "Typed application code" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    heading: "Backend engineering",
    description: "APIs and services that connect business rules, integrations and background jobs.",
    tools: [
      { logo: "nodejs", name: "Node.js", use: "Server-side JavaScript" },
      { logo: "nestjs", name: "NestJS", use: "APIs and services" },
      { logo: "express", name: "Express", use: "HTTP routing" },
    ],
  },
  {
    id: "data",
    label: "Data & storage",
    heading: "Databases and data access",
    description: "Structured data for reservations, accounts and the records teams depend on.",
    tools: [
      { logo: "postgresql", name: "PostgreSQL", use: "Relational database" },
      { logo: "mysql", name: "MySQL", use: "Relational database" },
      { logo: "prisma", name: "Prisma", use: "Data access and migrations" },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    heading: "Quality engineering",
    description: "Automated checks for business logic and the workflows users run in their browsers.",
    tools: [
      { logo: "playwright", name: "Playwright", use: "Browser testing" },
      { logo: "vitest", name: "Vitest", use: "Unit and integration tests" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & delivery",
    heading: "Cloud and delivery",
    description: "Repeatable builds and deployments that help teams ship and maintain their software.",
    tools: [
      { logo: "docker", name: "Docker", use: "Containerized applications" },
      { logo: "githubactions", name: "GitHub Actions", use: "Build and deploy automation" },
      { logo: "digitalocean", name: "DigitalOcean", use: "Cloud hosting" },
    ],
  },
];

export default function TechnologyShowcase() {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = technologyGroups.length - 1;
    let next: number;

    switch (event.key) {
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="ed-tech-showcase">
      <div className="ed-tech-tabs" role="tablist" aria-label="Technology categories">
        {technologyGroups.map((group, index) => (
          <button
            key={group.id}
            ref={(tab) => { tabs.current[index] = tab; }}
            type="button"
            role="tab"
            id={`${id}-${group.id}-tab`}
            aria-controls={`${id}-${group.id}-panel`}
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {technologyGroups.map((group, index) => (
        <div
          key={group.id}
          className="ed-tech-panel"
          id={`${id}-${group.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${group.id}-tab`}
          tabIndex={0}
          hidden={activeIndex !== index}
        >
          <div className="ed-tech-panel-copy">
            <h3>{group.heading}</h3>
            <p>{group.description}</p>
          </div>
          <ul className="ed-tech-logos" role="list">
            {group.tools.map((tool) => (
              <li key={tool.logo}>
                <Image src={`/images/technologies/${tool.logo}.svg`} alt="" width={48} height={48} />
                <div>
                  <strong>{tool.name}</strong>
                  <span>{tool.use}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
