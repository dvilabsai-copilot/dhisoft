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

export type HomeContent = {
  navigation: { brandName: string; logoText: string; links: CmsLink[]; cta: CmsLink };
  seo: { title: string; description: string; keywords: string[]; ogImage?: string };
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
  platform: { eyebrow: string; heading: string; description: string; features: string[] };
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
};

export type PublicHomeResponse = {
  key: string;
  version: number;
  publishedAt: string | null;
  content: HomeContent;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string { return typeof value === 'string'; }
function isSafeHref(value: unknown): value is string { return isString(value) && /^(#|\/(?!\/)|https:\/\/|mailto:|tel:)[^<>'"`]*$/i.test(value); }
function isSafeAssetUrl(value: unknown): value is string { return isString(value) && /^(\/(?!\/)|https:\/\/)[^<>'"`]*$/i.test(value); }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every(isString); }
function isLink(value: unknown): value is CmsLink { return isRecord(value) && isString(value.label) && isSafeHref(value.href); }
function isItem(value: unknown): value is CmsProduct {
  return isRecord(value) && isString(value.key) && isString(value.icon) && isString(value.title) && isString(value.text)
    && typeof value.sortOrder === 'number' && Number.isInteger(value.sortOrder) && typeof value.isActive === 'boolean';
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
  return isRecord(navigation) && isString(navigation.brandName) && isString(navigation.logoText)
    && Array.isArray(navigation.links) && navigation.links.every(isLink) && isLink(navigation.cta)
    && isRecord(seo) && isString(seo.title) && isString(seo.description) && isStringArray(seo.keywords)
    && (seo.ogImage === undefined || isSafeAssetUrl(seo.ogImage))
    && isRecord(hero) && isSafeAssetUrl(hero.backgroundImage) && isString(hero.badge) && isString(hero.titlePrefix)
    && isString(hero.titleHighlight) && isString(hero.description) && isLink(hero.primaryCta) && isLink(hero.secondaryCta)
    && isStringArray(value.audiences)
    && isRecord(products) && isString(products.eyebrow) && isString(products.heading)
    && Array.isArray(products.items) && products.items.every(isItem)
    && isRecord(platform) && isString(platform.eyebrow) && isString(platform.heading)
    && isString(platform.description) && isStringArray(platform.features)
    && isRecord(capabilities) && Array.isArray(capabilities.items) && capabilities.items.every(isItem)
    && isRecord(pricing) && isString(pricing.heading) && isString(pricing.description)
    && isString(pricing.cardLabel) && isString(pricing.priceText) && isString(pricing.cardDescription) && isLink(pricing.cta)
    && isRecord(footer) && isString(footer.brandName) && isString(footer.description) && isString(footer.email)
    && isRecord(dashboard) && typeof dashboard.enabled === 'boolean' && isString(dashboard.revenue)
    && isString(dashboard.revenueTarget) && isString(dashboard.uptime) && isString(dashboard.dataPoints) && isString(dashboard.growth);
}

export function isPublicHomeResponse(value: unknown): value is PublicHomeResponse {
  return isRecord(value) && value.key === 'home' && typeof value.version === 'number'
    && (value.publishedAt === null || isString(value.publishedAt)) && isHomeContent(value.content);
}

export function activeSorted<T extends { sortOrder: number; isActive: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.isActive).slice().sort((a, b) => a.sortOrder - b.sortOrder);
}
