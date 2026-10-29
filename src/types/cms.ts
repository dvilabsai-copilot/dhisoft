export type CmsLink = { label: string; href: string };

export type CmsProduct = {
  key: string;
  icon: string;
  title: string;
  text: string;
  sortOrder: number;
  isActive: boolean;
};

export type CmsCapability = CmsProduct;

export type CmsProject = {
  key: string;
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  shortDescription: string;
  description: string;
  visual: string;
  posterImage?: string;
  videoSource?: "none" | "mp4" | "youtube";
  videoUrl?: string;
  videoDuration?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  stack: string[];
  capabilities: string[];
  status: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
};

export type CmsDomain = {
  key: string;
  title: string;
  description: string;
  items: string[];
  sortOrder: number;
  isActive: boolean;
};

export type CmsPrinciple = {
  key: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

export type CmsStep = {
  key: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomeContent = {
  navigation: {
    brandName: string;
    logoText: string;
    links: CmsLink[];
    cta: CmsLink;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  hero: {
    backgroundImage: string;
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    primaryCta: CmsLink;
    secondaryCta: CmsLink;
  };
  audiences: string[];
  products: { eyebrow: string; heading: string; items: CmsProduct[] };
  platform: {
    eyebrow: string;
    heading: string;
    description: string;
    features: string[];
  };
  capabilities: { items: CmsCapability[] };
  pricing: {
    heading: string;
    description: string;
    cardLabel: string;
    priceText: string;
    cardDescription: string;
    cta: CmsLink;
  };
  footer: { brandName: string; description: string; email: string };
  dashboard: {
    enabled: boolean;
    revenue: string;
    revenueTarget: string;
    uptime: string;
    dataPoints: string;
    growth: string;
  };
  portfolio?: {
    eyebrow: string;
    heading: string;
    description: string;
    projects: CmsProject[];
  };
  domains?: { eyebrow: string; heading: string; items: CmsDomain[] };
  principles?: {
    eyebrow: string;
    heading: string;
    description: string;
    items: CmsPrinciple[];
  };
  engagement?: {
    eyebrow: string;
    heading: string;
    description: string;
    steps: CmsStep[];
  };
};

export type PublicHomeResponse = {
  key: string;
  version: number;
  publishedAt: string | null;
  content: HomeContent;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
function isSafeHref(value: unknown): value is string {
  return (
    isString(value) &&
    /^(#|\/(?!\/)|https:\/\/|mailto:|tel:)[^<>'"`]*$/i.test(value)
  );
}
function isSafeAssetUrl(value: unknown): value is string {
  return isString(value) && /^(\/(?!\/)|https:\/\/)[^<>'"`]*$/i.test(value);
}
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}
function isLink(value: unknown): value is CmsLink {
  return isRecord(value) && isString(value.label) && isSafeHref(value.href);
}
function isItem(value: unknown): value is CmsProduct {
  return (
    isRecord(value) &&
    isString(value.key) &&
    isString(value.icon) &&
    isString(value.title) &&
    isString(value.text) &&
    typeof value.sortOrder === "number" &&
    Number.isInteger(value.sortOrder) &&
    typeof value.isActive === "boolean"
  );
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}
function isOptionalVideoSource(
  value: unknown,
): value is "none" | "mp4" | "youtube" | undefined {
  return (
    value === undefined ||
    value === "none" ||
    value === "mp4" ||
    value === "youtube"
  );
}
function isProject(value: unknown): value is CmsProject {
  return (
    isRecord(value) &&
    isString(value.key) &&
    isString(value.slug) &&
    isString(value.title) &&
    isString(value.eyebrow) &&
    isString(value.category) &&
    isString(value.shortDescription) &&
    isString(value.description) &&
    isString(value.visual) &&
    isOptionalString(value.posterImage) &&
    isOptionalVideoSource(value.videoSource) &&
    isOptionalString(value.videoUrl) &&
    isOptionalString(value.videoDuration) &&
    isOptionalString(value.liveDemoUrl) &&
    isOptionalString(value.githubUrl) &&
    isOptionalString(value.caseStudyUrl) &&
    isStringArray(value.stack) &&
    isStringArray(value.capabilities) &&
    isString(value.status) &&
    typeof value.featured === "boolean" &&
    typeof value.sortOrder === "number" &&
    Number.isInteger(value.sortOrder) &&
    typeof value.isActive === "boolean"
  );
}
function isDomain(value: unknown): value is CmsDomain {
  return (
    isRecord(value) &&
    isString(value.key) &&
    isString(value.title) &&
    isString(value.description) &&
    isStringArray(value.items) &&
    typeof value.sortOrder === "number" &&
    Number.isInteger(value.sortOrder) &&
    typeof value.isActive === "boolean"
  );
}
function isPrinciple(value: unknown): value is CmsPrinciple {
  return (
    isRecord(value) &&
    isString(value.key) &&
    isString(value.title) &&
    isString(value.description) &&
    isString(value.icon) &&
    typeof value.sortOrder === "number" &&
    Number.isInteger(value.sortOrder) &&
    typeof value.isActive === "boolean"
  );
}
function isStep(value: unknown): value is CmsStep {
  return (
    isRecord(value) &&
    isString(value.key) &&
    isString(value.title) &&
    isString(value.description) &&
    typeof value.sortOrder === "number" &&
    Number.isInteger(value.sortOrder) &&
    typeof value.isActive === "boolean"
  );
}

export function isHomeContent(value: unknown): value is HomeContent {
  if (!isRecord(value)) return false;
  const navigation = value.navigation;
  const seo = value.seo;
  const hero = value.hero;
  const products = value.products;
  const platform = value.platform;
  const capabilities = value.capabilities;
  const pricing = value.pricing;
  const footer = value.footer;
  const dashboard = value.dashboard;
  const portfolio = value.portfolio;
  const domains = value.domains;
  const principles = value.principles;
  const engagement = value.engagement;
  return (
    isRecord(navigation) &&
    isString(navigation.brandName) &&
    isString(navigation.logoText) &&
    Array.isArray(navigation.links) &&
    navigation.links.every(isLink) &&
    isLink(navigation.cta) &&
    isRecord(seo) &&
    isString(seo.title) &&
    isString(seo.description) &&
    isStringArray(seo.keywords) &&
    (seo.ogImage === undefined || isSafeAssetUrl(seo.ogImage)) &&
    isRecord(hero) &&
    isSafeAssetUrl(hero.backgroundImage) &&
    isString(hero.badge) &&
    isString(hero.titlePrefix) &&
    isString(hero.titleHighlight) &&
    isString(hero.description) &&
    isLink(hero.primaryCta) &&
    isLink(hero.secondaryCta) &&
    isStringArray(value.audiences) &&
    isRecord(products) &&
    isString(products.eyebrow) &&
    isString(products.heading) &&
    Array.isArray(products.items) &&
    products.items.every(isItem) &&
    isRecord(platform) &&
    isString(platform.eyebrow) &&
    isString(platform.heading) &&
    isString(platform.description) &&
    isStringArray(platform.features) &&
    isRecord(capabilities) &&
    Array.isArray(capabilities.items) &&
    capabilities.items.every(isItem) &&
    isRecord(pricing) &&
    isString(pricing.heading) &&
    isString(pricing.description) &&
    isString(pricing.cardLabel) &&
    isString(pricing.priceText) &&
    isString(pricing.cardDescription) &&
    isLink(pricing.cta) &&
    isRecord(footer) &&
    isString(footer.brandName) &&
    isString(footer.description) &&
    isString(footer.email) &&
    isRecord(dashboard) &&
    typeof dashboard.enabled === "boolean" &&
    isString(dashboard.revenue) &&
    isString(dashboard.revenueTarget) &&
    isString(dashboard.uptime) &&
    isString(dashboard.dataPoints) &&
    isString(dashboard.growth) &&
    (portfolio === undefined ||
      (isRecord(portfolio) &&
        isString(portfolio.eyebrow) &&
        isString(portfolio.heading) &&
        isString(portfolio.description) &&
        Array.isArray(portfolio.projects) &&
        portfolio.projects.every(isProject))) &&
    (domains === undefined ||
      (isRecord(domains) &&
        isString(domains.eyebrow) &&
        isString(domains.heading) &&
        Array.isArray(domains.items) &&
        domains.items.every(isDomain))) &&
    (principles === undefined ||
      (isRecord(principles) &&
        isString(principles.eyebrow) &&
        isString(principles.heading) &&
        isString(principles.description) &&
        Array.isArray(principles.items) &&
        principles.items.every(isPrinciple))) &&
    (engagement === undefined ||
      (isRecord(engagement) &&
        isString(engagement.eyebrow) &&
        isString(engagement.heading) &&
        isString(engagement.description) &&
        Array.isArray(engagement.steps) &&
        engagement.steps.every(isStep)))
  );
}

export function isPublicHomeResponse(
  value: unknown,
): value is PublicHomeResponse {
  return (
    isRecord(value) &&
    value.key === "home" &&
    typeof value.version === "number" &&
    (value.publishedAt === null || isString(value.publishedAt)) &&
    isHomeContent(value.content)
  );
}

export function activeSorted<
  T extends { sortOrder: number; isActive: boolean },
>(items: T[]): T[] {
  return items
    .filter((item) => item.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
