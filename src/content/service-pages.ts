type ProjectPlanning = {
  title: string;
  items: { title: string; description: string }[];
  questions: { question: string; answer: string }[];
};

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
  planning?: ProjectPlanning;
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "custom-software",
    title: "Custom software development",
    summary: "DHISOFT builds custom web applications, business portals and workflow software for teams that have outgrown spreadsheets and disconnected tools.",
    problem: "When a process spans spreadsheets, inboxes and disconnected tools, teams lose context and work becomes difficult to track.",
    solution: ["Web applications and business portals", "Role-based workflows and approvals", "Operational dashboards and reporting", "Data models that reflect real business rules"],
    useCases: ["Use an internal operations application to replace spreadsheet approvals", "Give customers or partners a self-service portal", "Bring orders, bookings or case records into one workflow"],
    approach: "We map who uses the software, what decisions they make, and where data needs to move. A first release can cover one workflow from intake through completion, including the permissions, exceptions and integrations it needs to run.",
    relatedWork: ["RainWood Direct Booking Engine", "Rural Skill & Livelihood OS", "Travel OS", "Yes We Care Admin Panel"],
    planning: {
      title: "What to prepare before scoping custom software",
      items: [
        { title: "Bring one real workflow", description: "Walk through a recent request from intake to completion. Show where staff copy data, wait for approval or handle exceptions. This gives the team a concrete starting point for a first release." },
        { title: "Separate users and system responsibilities", description: "List who creates, approves and views each record. Identify which records already live in accounting, CRM or another tool, and which system should own them after launch." },
        { title: "Agree on a release you can test", description: "Pick a group of users, define what a successful handoff looks like and include failure cases such as missing information or a rejected approval." },
      ],
      questions: [
        { question: "Can you integrate with software we already use?", answer: "Yes, where the existing system provides a suitable API or export. We check access, data ownership and failure handling before committing to the integration. A staged rollout can keep everyday work running while a new workflow is introduced." },
        { question: "What affects the cost and timeline?", answer: "The number of workflows and user roles, the condition of the existing data, the integrations, and the launch requirements all affect scope. A single workflow with known rules is easier to estimate than a full system replacement." },
      ],
    },
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
  title: "Travel software development",
  summary: "DHISOFT builds hotel booking engines, tour operator booking systems, travel agent portals and supplier integrations for travel and hospitality businesses.",
  problem: "Travel workflows cross customers, agents, properties, suppliers, availability and payments. When those steps live in separate tools, teams have to bridge the gaps by hand.",
  capabilities: ["Direct booking and reservation flows", "Travel enquiry, itinerary and quotation workflows", "Vendor and agent-facing product surfaces", "Availability, booking and operational records", "Supplier APIs, payment events and background jobs"],
  approach: "We model the booking lifecycle and its edge cases first: availability, holds, confirmation, cancellation and recovery. The product experience and integration boundaries are then designed around that lifecycle.",
  work: ["RainWood Direct Booking Engine", "Voya Vendor Platform", "Travel OS"],
  planning: {
    title: "What your travel booking system needs to handle",
    items: [
      { title: "Direct hotel booking", description: "Decide where room inventory and rates come from. Account for occupancy rules, temporary room holds, payment confirmation and cancellations that return a room to inventory. RainWood shows this lifecycle in a direct booking system." },
      { title: "Tour operator and activity booking", description: "For a guided experience such as a food tour, define bookable departures, seats per departure, the booking cut-off and who can reschedule a guest. Voya shows how vendors publish experiences and how agents book them." },
      { title: "Agent portals and supplier APIs", description: "Decide which system owns availability, who issues the voucher and what the agent sees while a supplier confirmation is pending. A repeated payment or supplier event should never create a second reservation." },
    ],
    questions: [
      { question: "When should we build a custom booking engine?", answer: "Consider a custom engine when your inventory, pricing, cancellation or fulfilment rules are central to your offering and your current platform cannot support them cleanly. If your rules are standard, an existing platform may cover the workflow with less implementation work." },
      { question: "What drives the scope of a travel software project?", answer: "The main factors are how many systems supply availability, how prices and capacity change, and who manages refunds, vouchers and settlements. Start by mapping one booking from search through confirmation and cancellation for a single product type." },
    ],
  } satisfies ProjectPlanning,
};

export const aboutDhi = {
  legalName: "DHI Software Systems Private Limited",
  title: "Software that fits the work.",
  summary: "DHI Software Systems Private Limited is a software engineering company based in Hyderabad, India.",
  description: "We work across business processes, product design and software engineering to build custom applications, SaaS products and operational technology. Our starting point is the real workflow: the people using it, the decisions it supports and the systems it needs to connect.",
  principles: ["Understand the operating context before shaping the interface.", "Keep business rules, permissions and data flows explicit.", "Build a useful release that can evolve with the product."],
};
