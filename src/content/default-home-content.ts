import type { HomeContent } from "../types/cms";

export const defaultHomeContent: HomeContent = {
  navigation: {
    brandName: "DHISOFT",
    logoText: "D",
    links: [
      { label: "Work", href: "#work" },
      { label: "Capabilities", href: "#capabilities" },
      { label: "Engineering", href: "#engineering" },
      { label: "Process", href: "#process" },
    ],
    cta: { label: "Discuss a product", href: "#contact" },
  },
  seo: {
    title: "DHISOFT | SaaS & Product Engineering Studio",
    description:
      "DHISOFT designs and builds production-oriented SaaS products, workflow systems, APIs and automation for complex businesses.",
    keywords: [
      "SaaS product engineering",
      "multi-tenant platforms",
      "workflow systems",
      "NestJS development",
      "API engineering",
    ],
    ogImage: "/images/cloud-bg.avif",
  },
  hero: {
    backgroundImage: "/images/cloud-bg.avif",
    badge: "Multi-domain SaaS & product engineering",
    titlePrefix: "We turn complex business workflows into",
    titleHighlight: "software people can run.",
    description:
      "From booking inventory and training outcomes to underwriting queues and commerce APIs, DHISOFT engineers the product, platform and operational logic behind serious business software.",
    primaryCta: { label: "Explore our work", href: "#work" },
    secondaryCta: { label: "Discuss a product", href: "#contact" },
  },
  audiences: [
    "SaaS platforms",
    "Workflow systems",
    "APIs & integrations",
    "Transaction engines",
    "Automation",
    "AI-enabled products",
    "Dashboards",
    "Multi-tenant systems",
  ],
  products: {
    eyebrow: "What we build",
    heading: "Software shaped around the work that matters.",
    items: [
      {
        key: "saas-platforms",
        icon: "Layers3",
        title: "SaaS platforms",
        text: "Multi-tenant operational software with roles, permissions, dashboards, audit trails and the domain model to support real teams.",
        sortOrder: 10,
        isActive: true,
      },
      {
        key: "workflow-systems",
        icon: "Workflow",
        title: "Workflow systems",
        text: "State-driven products that replace spreadsheets, email and fragmented manual operations with visible, accountable processes.",
        sortOrder: 20,
        isActive: true,
      },
      {
        key: "apis-integrations",
        icon: "Network",
        title: "APIs & integrations",
        text: "Secure application layers, supplier boundaries, payment flows, webhooks and background workers that keep systems connected.",
        sortOrder: 30,
        isActive: true,
      },
      {
        key: "transactional-products",
        icon: "BadgeCheck",
        title: "Transactional products",
        text: "Booking, inventory, reservations and payment systems where consistency, idempotency and recovery are part of the product.",
        sortOrder: 40,
        isActive: true,
      },
    ],
  },
  platform: {
    eyebrow: "The engineering underneath",
    heading: "One product discipline. Many operating environments.",
    description:
      "The visible product is only one layer. We connect experience design to domain services, data, integrations and delivery so the system holds together after launch.",
    features: [
      "React / Next.js product surfaces",
      "Node.js / NestJS application layers",
      "PostgreSQL, MySQL & Prisma",
      "Queues, workers & webhooks",
      "Role-based access & auditability",
      "Docker, CI/CD & observability",
    ],
  },
  capabilities: {
    items: [
      {
        key: "product-discovery",
        icon: "ScanSearch",
        title: "Understand the workflow",
        text: "Map users, decisions, states, data and integrations before writing the first screen.",
        sortOrder: 10,
        isActive: true,
      },
      {
        key: "product-design",
        icon: "PanelsTopLeft",
        title: "Design the product",
        text: "Turn domain complexity into interfaces that make the next action obvious for every role.",
        sortOrder: 20,
        isActive: true,
      },
      {
        key: "full-stack-build",
        icon: "Code2",
        title: "Engineer the system",
        text: "Build the frontend, backend, APIs, automation and delivery path as one coherent product.",
        sortOrder: 30,
        isActive: true,
      },
    ],
  },
  pricing: {
    heading: "Have a workflow that needs software?",
    description:
      "Bring the messy version: spreadsheets, approval chains, disconnected APIs or a product idea that needs a technical shape. We will help find the smallest credible path to a working system.",
    cardLabel: "A good first conversation covers",
    priceText: "Workflow → Product",
    cardDescription:
      "Industry, current process, users, integrations, constraints and the next useful milestone.",
    cta: { label: "Start the conversation", href: "#contact" },
  },
  footer: {
    brandName: "DHISOFT",
    description: "SaaS & product engineering for complex businesses.",
    email: "hello@dhisoft.com",
  },
  dashboard: {
    enabled: false,
    revenue: "",
    revenueTarget: "",
    uptime: "",
    dataPoints: "",
    growth: "",
  },
  portfolio: {
    eyebrow: "Selected work",
    heading: "Products we have engineered.",
    description:
      "A cross-section of operational platforms, transaction engines and API systems. The interface is only the surface; the workflow is the work.",
    projects: [
      {
        key: "rural-skill-os",
        slug: "rural-skill-os",
        title: "Rural Skill & Livelihood OS",
        eyebrow: "Workforce & livelihood",
        category: "Enterprise workflow",
        shortDescription:
          "A multi-tenant operating system for the journey from candidate to income outcome.",
        description:
          "Candidate, counselling, training, assessment, certification, apprenticeship, employment and retention in one auditable workflow.",
        visual: "rural",
        stack: ["React", "NestJS", "PostgreSQL"],
        capabilities: ["Multi-tenancy", "RBAC", "Outcome tracking"],
        status: "Portfolio system",
        featured: true,
        sortOrder: 10,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl:
          "https://github.com/kkversile/dhisoft-rural-skill-livelihood-os",
      },
      {
        key: "rainwood",
        slug: "rainwood",
        title: "RainWood Direct Booking Engine",
        eyebrow: "Travel & hospitality",
        category: "Transactional platform",
        shortDescription:
          "A hotel booking and reservation system where inventory consistency is the product.",
        description:
          "Availability, occupancy-aware pricing, holds, reservations, payments, webhooks, vouchers, cancellations and inventory restoration.",
        visual: "rainwood",
        stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL"],
        capabilities: [
          "Concurrency safety",
          "Idempotent webhooks",
          "Supplier boundary",
        ],
        status: "Open-source system",
        featured: true,
        sortOrder: 20,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl: "https://github.com/kkversile/rainwood",
      },
      {
        key: "community-events",
        slug: "community-events",
        title: "Community Events SaaS",
        eyebrow: "Communities & membership",
        category: "Operational SaaS",
        shortDescription:
          "A community operations platform that connects residents, events, capacity and contributions.",
        description:
          "Resident onboarding, CSV import, events, slot capacity, waitlists, contributions, payments, expenses and reports.",
        visual: "community",
        stack: ["React", "Node.js", "PostgreSQL"],
        capabilities: ["Capacity workflows", "Waitlists", "Reporting"],
        status: "Portfolio system",
        featured: true,
        sortOrder: 30,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl: "https://github.com/kkversile/community-events-saas",
      },
      {
        key: "travel-os",
        slug: "travel-os",
        title: "DHISOFT Travel OS",
        eyebrow: "Travel operations",
        category: "Workflow platform",
        shortDescription:
          "A workflow system that moves a trip from enquiry to operation without losing the thread.",
        description:
          "Customer, enquiry, itinerary, costing, quotation, booking, payment and operations in a multi-tenant product surface.",
        visual: "travel",
        stack: ["React", "NestJS", "MySQL"],
        capabilities: [
          "Workflow modelling",
          "Quotations",
          "Role-based operations",
        ],
        status: "Portfolio system",
        featured: false,
        sortOrder: 40,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl: "https://github.com/kkversile/dhisoft-travel-os",
      },
      {
        key: "mortgage-uwa",
        slug: "mortgage-uwa",
        title: "Mortgage UWA",
        eyebrow: "Financial workflow",
        category: "Demo / synthetic data",
        shortDescription:
          "A portfolio demonstration of consumer, operations and underwriting workflows.",
        description:
          "Document processing, private object storage, queue-driven OCR, conditions, tasks and audit trails. Synthetic/demo software; not a lending decision engine.",
        visual: "mortgage",
        stack: ["Next.js", "NestJS", "PostgreSQL"],
        capabilities: [
          "Queue processing",
          "Document workflows",
          "Audit trails",
        ],
        status: "Portfolio demo",
        featured: false,
        sortOrder: 50,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl: "https://github.com/kkversile/mortgage-uwa-v0.1",
      },
      {
        key: "commerce-api",
        slug: "commerce-api",
        title: "InfinityDesignz Commerce API",
        eyebrow: "Commerce",
        category: "API platform",
        shortDescription:
          "A modular commerce API for catalogue, merchandising, orders and delivery.",
        description:
          "Products, categories, variants, promotions, coupons, wishlist, cart, orders, payments, delivery and dashboards.",
        visual: "commerce",
        stack: ["NestJS", "TypeScript", "REST"],
        capabilities: [
          "Modular architecture",
          "Catalogue APIs",
          "Order lifecycle",
        ],
        status: "API portfolio",
        featured: false,
        sortOrder: 60,
        isActive: true,
        videoSource: "mp4",
        videoUrl: "/media/projects/community-project-demo.mp4",
        githubUrl: "https://github.com/kkversile/api.infinitydesignz",
      },
    ],
  },
  domains: {
    eyebrow: "Where the work applies",
    heading: "Different domains. Familiar engineering problems.",
    items: [
      {
        key: "travel",
        title: "Travel & hospitality",
        description:
          "Operations, inventory, itineraries, reservations and supplier integrations.",
        items: ["Booking flows", "Availability", "Quotations", "Payments"],
        sortOrder: 10,
        isActive: true,
      },
      {
        key: "workforce",
        title: "Workforce & livelihood",
        description:
          "Longitudinal journeys where outcomes depend on many hand-offs.",
        items: ["Candidates", "Training", "Certification", "Employment"],
        sortOrder: 20,
        isActive: true,
      },
      {
        key: "communities",
        title: "Communities & membership",
        description:
          "The daily operating layer for people, events, capacity and communication.",
        items: ["Onboarding", "Events", "Waitlists", "Contributions"],
        sortOrder: 30,
        isActive: true,
      },
      {
        key: "financial",
        title: "Financial workflows",
        description:
          "Document-heavy systems that need queues, conditions and auditability.",
        items: [
          "Documents",
          "OCR queues",
          "Underwriting tasks",
          "Audit trails",
        ],
        sortOrder: 40,
        isActive: true,
      },
      {
        key: "commerce",
        title: "Commerce",
        description:
          "Connected catalogue and transaction systems with a clean API boundary.",
        items: ["Catalogue", "Variants", "Promotions", "Orders"],
        sortOrder: 50,
        isActive: true,
      },
      {
        key: "custom",
        title: "Custom SaaS",
        description:
          "If the operation is complex, the product should make the complexity legible.",
        items: ["Multi-tenancy", "RBAC", "Dashboards", "Reporting"],
        sortOrder: 60,
        isActive: true,
      },
    ],
  },
  principles: {
    eyebrow: "Product engineering principles",
    heading: "The details that make software dependable.",
    description:
      "These are not decorative badges. They are the decisions that keep a workflow product understandable and safe as more users, states and integrations arrive.",
    items: [
      {
        key: "multi-tenancy",
        title: "Multi-tenancy",
        description:
          "Boundaries are designed into the data and authorization model.",
        icon: "Building2",
        sortOrder: 10,
        isActive: true,
      },
      {
        key: "workflow-modelling",
        title: "Workflow modelling",
        description:
          "States, transitions and ownership stay explicit instead of hiding in screens.",
        icon: "GitBranch",
        sortOrder: 20,
        isActive: true,
      },
      {
        key: "transaction-integrity",
        title: "Transaction integrity",
        description:
          "Reservations, payments and inventory change together or recover cleanly.",
        icon: "ShieldCheck",
        sortOrder: 30,
        isActive: true,
      },
      {
        key: "idempotency",
        title: "Idempotency",
        description:
          "Retries and webhooks do not create duplicate business events.",
        icon: "RefreshCw",
        sortOrder: 40,
        isActive: true,
      },
      {
        key: "auditability",
        title: "Auditability",
        description:
          "Important decisions leave a useful trail for operators and teams.",
        icon: "History",
        sortOrder: 50,
        isActive: true,
      },
      {
        key: "observability",
        title: "Observability",
        description:
          "Health, jobs, failures and integrations are visible after deployment.",
        icon: "Activity",
        sortOrder: 60,
        isActive: true,
      },
    ],
  },
  engagement: {
    eyebrow: "How we build",
    heading:
      "A product engineering engagement with a clear next step at every stage.",
    description:
      "The work stays grounded in the workflow, then gets progressively more real: model, interface, system, deployment and learning.",
    steps: [
      {
        key: "discover",
        title: "Discover",
        description:
          "Understand users, workflow, data, decisions and integration landscape.",
        sortOrder: 10,
        isActive: true,
      },
      {
        key: "design",
        title: "Design",
        description:
          "Shape the domain model, architecture, UX and API contracts.",
        sortOrder: 20,
        isActive: true,
      },
      {
        key: "build",
        title: "Build",
        description:
          "Engineer frontend, backend, integrations, automation and tests.",
        sortOrder: 30,
        isActive: true,
      },
      {
        key: "launch",
        title: "Launch",
        description:
          "Deploy with sensible monitoring, documentation and production readiness.",
        sortOrder: 40,
        isActive: true,
      },
      {
        key: "evolve",
        title: "Evolve",
        description:
          "Improve the system as the operation, users and constraints change.",
        sortOrder: 50,
        isActive: true,
      },
    ],
  },
};
