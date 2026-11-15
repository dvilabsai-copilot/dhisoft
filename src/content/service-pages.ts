export type ServicePageContent = {
  slug: string;
  title: string;
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
    summary: "Software shaped around the way your business actually works.",
    problem: "When a process spans spreadsheets, inboxes and disconnected tools, teams lose context and work becomes difficult to track.",
    solution: ["Web applications and business portals", "Role-based workflows and approvals", "Operational dashboards and reporting", "Data models that reflect real business rules"],
    useCases: ["Replace manual handoffs", "Give customers or partners a self-service portal", "Bring operational records into one workflow"],
    approach: "We map the people, decisions, states and data first. Then we shape a useful first release, build it end to end and leave room for the next stage.",
    relatedWork: ["Rural Skill & Livelihood OS", "Travel OS", "Yes We Care Admin Panel"],
  },
  {
    slug: "saas-product-engineering",
    title: "SaaS & product engineering",
    summary: "Multi-tenant products built around clear roles, reliable workflows and a practical path to launch.",
    problem: "A product has to support more than its first screen: tenant boundaries, permissions, lifecycle states and administration all shape the experience.",
    solution: ["Product discovery and technical definition", "Multi-tenant application architecture", "Customer, staff and administrator experiences", "Core product workflows and reporting"],
    useCases: ["Turn an internal tool into a product", "Build a new B2B SaaS platform", "Extend an existing product with new workflows"],
    approach: "We connect product decisions to domain models, access rules and delivery milestones, then build the interface and application layers together.",
    relatedWork: ["Community Events SaaS", "VOYA Vendor Platform", "Rural Skill & Livelihood OS"],
  },
  {
    slug: "enterprise-workflows",
    title: "Enterprise applications & workflows",
    summary: "Connect operational steps, information and people in software teams can use every day.",
    problem: "As processes grow, approvals, ownership and current status can be spread across teams and systems.",
    solution: ["Internal operations applications", "Approval and case-management workflows", "Role-aware workspaces", "Audit-friendly status and history"],
    useCases: ["Coordinate requests across departments", "Track work from intake through completion", "Create operational views for different roles"],
    approach: "We make the workflow explicit: who acts, what information they need, what changes next and how exceptions are handled.",
    relatedWork: ["Yes We Care Admin Panel", "Travel OS", "Mortgage UWA"],
  },
  {
    slug: "api-integrations",
    title: "API development & integrations",
    summary: "Connect products and services through predictable interfaces and recoverable data flows.",
    problem: "Integrations become fragile when retries, duplicate events, partial failures and changing provider data are not part of the design.",
    solution: ["REST API design and implementation", "Supplier and third-party service connections", "Webhooks and background processing", "Validation, retries and integration-level observability"],
    useCases: ["Connect a booking or payment provider", "Synchronize product and operational data", "Expose a stable API for partner systems"],
    approach: "We define the boundary and data contract, handle asynchronous work where needed, and plan for retries and failure recovery.",
    relatedWork: ["RainWood Direct Booking Engine", "VOYA Vendor Platform", "Travel OS"],
  },
  {
    slug: "ai-automation",
    title: "AI integration & automation",
    summary: "Add AI to a workflow when it can help people make progress, with clear review and control points.",
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
  title: "Travel & hospitality technology",
  summary: "Booking and operations software for the connected journey from enquiry to stay.",
  problem: "Travel workflows cross customers, agents, properties, suppliers, availability and payments. When those steps live in separate tools, teams have to bridge the gaps by hand.",
  capabilities: ["Direct booking and reservation flows", "Travel enquiry, itinerary and quotation workflows", "Vendor and agent-facing product surfaces", "Availability, booking and operational records", "Supplier APIs, payment events and background jobs"],
  approach: "We model the booking lifecycle and its edge cases first: availability, holds, confirmation, cancellation and recovery. The product experience and integration boundaries are then designed around that lifecycle.",
  work: ["RainWood Direct Booking Engine", "Travel OS", "VOYA Vendor Platform"],
};

export const aboutDhi = {
  title: "Software that fits the work.",
  summary: "DHI Software Systems Private Limited is a software engineering company based in Hyderabad, India.",
  description: "We work across business processes, product design and software engineering to build custom applications, SaaS products and operational technology. Our starting point is the real workflow: the people using it, the decisions it supports and the systems it needs to connect.",
  principles: ["Understand the operating context before shaping the interface.", "Keep business rules, permissions and data flows explicit.", "Build a useful release that can evolve with the product."],
};
