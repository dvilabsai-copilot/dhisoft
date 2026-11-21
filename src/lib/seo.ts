/**
 * Public SEO helpers. Set NEXT_PUBLIC_SITE_URL to the production origin
 * in deployment, for example https://dhisoft.in.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhisoft.in";
export const SITE_ORIGIN = new URL(configuredSiteUrl).origin;

export function absoluteSiteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteSiteUrl("/#organization"),
    name: "DHISOFT",
    legalName: "DHI Software Systems Private Limited",
    url: SITE_ORIGIN,
    logo: absoluteSiteUrl("/images/dhisoft-logo.png"),
    description: "Custom software, SaaS products and operational technology engineering.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressCountry: "IN",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteSiteUrl("/#website"),
    name: "DHISOFT",
    url: SITE_ORIGIN,
    publisher: { "@id": absoluteSiteUrl("/#organization") },
  };
}

export function serviceJsonLd(service: { slug: string; title: string; summary: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: absoluteSiteUrl("/services/" + service.slug),
    provider: { "@id": absoluteSiteUrl("/#organization") },
  };
}
