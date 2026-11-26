export type ServicePageContent = {
  slug: string;
  title: string;
  searchTitle?: string;
  summary: string;
  problem: string;
  solution: string[];
  useCases: string[];
  approach: string;
  relatedWork: string[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "custom-software",
    title: "Custom software development",
    summary: "DHISOFT builds custom web applications, business portals and workflow software for teams that have outgrown spreadsheets and disconnected tools.",
    problem: "When a process spans spreadsheets, inboxes and disconnected tools, teams lose context and work becomes difficult to track.",
    solution: ["Web applications and business portals", "Role-based workflows and approvals", "Operational dashboards and reporting", "Data models that reflect real business rules"],
    useCases: ["Replace manual handoffs", "Give customers or partners a self-service portal", "Bring operational records into one workflow"],
    approach: "We map who uses the software, what decisions they make, and where data needs to move. A first release can cover one workflow from intake through completion, including the permissions, exceptions and integrations it needs to run.",
    relatedWork: ["RainWood Direct Booking Engine", "Rural Skill & Livelihood OS", "Travel OS", "Yes We Care Admin Panel"],
  },
  {
    slug: "saas-product-engineering",
    title: "SaaS & product engineering",
    searchTitle: "SaaS Product Development Services",
    summary: "Build a B2B SaaS product with DHISOFT, from a focused MVP to a multi-tenant platform with customer, staff and administrator workflows.",
    problem: "A product has to support more than its first screen: tenant boundaries, permissions, lifecycle states and administration all shape the experience.",
    solution: ["Product discovery and technical definition", "Multi-tenant application architecture", "Customer, staff and administrator experiences", "Core product workflows and reporting"],
    useCases: ["Turn an internal tool into a product", "Build a new B2B SaaS platform", "Extend an existing product with new workflows"],
    approach: "We identify the core job customers will use the product for and build the first release around it. We design tenant data boundaries, user permissions and onboarding together so later product workflows, billing or integrations have a clear place to fit.",
    relatedWork: ["Voya Vendor Platform", "Community Events SaaS", "Rural Skill & Livelihood OS"],
  },
  {
    slug: "enterprise-workflows",
    title: "Enterprise applications & workflows",
    searchTitle: "Enterprise Workflow Software Development",
    summary: "Build internal workflow software for approvals, case management, reporting and operational handoffs across departments.",
    problem: "As processes grow, approvals, ownership and current status can be spread across teams and systems.",
    solution: ["Internal operations applications", "Approval and case-management workflows", "Role-aware workspaces", "Audit-friendly status and history"],
    useCases: ["Coordinate requests across departments", "Track work from intake through completion", "Create operational views for different roles"],
    approach: "We make the workflow explicit: who acts, what information they need, what changes next and how exceptions are handled.",
    relatedWork: ["Yes We Care Admin Panel", "Travel OS", "Mortgage UWA"],
  },
  {
    slug: "api-integrations",
    title: "API development & integrations",
    searchTitle: "API Development and Integration Services",
    summary: "Connect supplier, booking and payment systems with DHISOFT's API development and integration services, including webhooks and background jobs.",
    problem: "Integrations become fragile when retries, duplicate events, partial failures and changing provider data are not part of the design.",
    solution: ["REST API design and implementation", "Supplier and third-party service connections", "Webhooks and background processing", "Validation, retries and integration-level observability"],
    useCases: ["Connect a booking or payment provider", "Synchronize product and operational data", "Expose a stable API for partner systems"],
    approach: "We agree which system owns each record, how data is validated, and how to detect and handle a failed exchange. For payments or bookings, we design retries and webhooks around the risk of duplicate events.",
    relatedWork: ["RainWood Direct Booking Engine", "Voya Vendor Platform", "Travel OS"],
  },
  {
    slug: "ai-automation",
    title: "AI integration & automation",
    searchTitle: "AI Integration and Workflow Automation Services",
    summary: "Add AI-assisted data and document workflows to business software, with review steps, API integrations and controls for generated outputs.",
    problem: "A model call alone does not make a useful business feature; inputs, permissions, human review and failure handling matter.",
    solution: ["AI-assisted content and data workflows", "Human review and approval steps", "Connections to existing product data and APIs", "Operational controls around generated output"],
    useCases: ["Assist staff with repetitive information tasks", "Add guided search or summarization to an application", "Reduce manual movement between workflow steps"],
    approach: "We start with a bounded use case, identify where a person stays in control, and evaluate the integration against the workflow before expanding it.",
    relatedWork: [],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}

export const travelIndustry = {
  title: "Travel & hospitality software development",
  summary: "DHISOFT builds direct booking engines, travel vendor portals and supplier integrations for hotels, agencies and travel marketplaces.",
  problem: "Travel workflows cross customers, agents, properties, suppliers, availability and payments. When those steps live in separate tools, teams have to bridge the gaps by hand.",
  capabilities: ["Direct booking and reservation flows", "Travel enquiry, itinerary and quotation workflows", "Vendor and agent-facing product surfaces", "Availability, booking and operational records", "Supplier APIs, payment events and background jobs"],
  approach: "We model the booking lifecycle and its edge cases first: availability, holds, confirmation, cancellation and recovery. The product experience and integration boundaries are then designed around that lifecycle.",
  work: ["RainWood Direct Booking Engine", "Voya Vendor Platform", "Travel OS"],
};

export const aboutDhi = {
  legalName: "DHI Software Systems Private Limited",
  title: "Software that fits the work.",
  summary: "DHI Software Systems Private Limited is a software engineering company based in Hyderabad, India.",
  description: "We work across business processes, product design and software engineering to build custom applications, SaaS products and operational technology. Our starting point is the real workflow: the people using it, the decisions it supports and the systems it needs to connect.",
  principles: ["Understand the operating context before shaping the interface.", "Keep business rules, permissions and data flows explicit.", "Build a useful release that can evolve with the product."],
};
