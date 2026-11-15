// Solid blocks remain an explicit preview. The other four share random selection and Next.
export const HERO_VARIANTS = ["rubik", "balls", "blocks", "3dBlocks", "maze"] as const;
export const HOMEPAGE_VARIANTS = ["rubik", "balls", "blocks", "maze"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

export function nextHeroVariant(current: HeroVariant): HeroVariant {
  const index = HOMEPAGE_VARIANTS.findIndex(variant => variant === current);
  return HOMEPAGE_VARIANTS[(index + 1) % HOMEPAGE_VARIANTS.length];
}

export function resolveHeroVariant(search: string, random: () => number = Math.random): HeroVariant {
  const forced = new URLSearchParams(search).get("show")?.toLowerCase();
  const variant = HERO_VARIANTS.find(value => value.toLowerCase() === forced);
  if (variant) return variant;
  // Preserve the earlier flat-block preview links.
  if (forced === "flat-blocks") return "blocks";
  // Sample anew on every page load. No saved assignment is read or written.
  return HOMEPAGE_VARIANTS[Math.floor(random() * HOMEPAGE_VARIANTS.length)];
}
