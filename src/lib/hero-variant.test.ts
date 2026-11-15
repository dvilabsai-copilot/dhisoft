import { describe, expect, it, vi } from "vitest";
import { HERO_VARIANTS, nextHeroVariant, resolveHeroVariant } from "./hero-variant";

describe("hero variant selection", () => {
  it.each(HERO_VARIANTS)("opens %s when explicitly requested", variant => {
    const random = vi.fn();
    expect(resolveHeroVariant(`?show=${variant}`, random)).toBe(variant);
    expect(random).not.toHaveBeenCalled();
  });
  it.each([["RUBIK", "rubik"], ["Balls", "balls"], ["BLOCKS", "blocks"], ["3dblocks", "3dBlocks"], ["3DBLOCKS", "3dBlocks"], ["3DbLoCkS", "3dBlocks"], ["FLAT-BLOCKS", "blocks"]] as const)("accepts case-insensitive override %s", (value, variant) => {
    expect(resolveHeroVariant(`?show=${value}`)).toBe(variant);
  });
  it.each([[0, "rubik"], [.25-.000001, "rubik"], [.25, "balls"], [.5-.000001, "balls"], [.5, "blocks"], [.75-.000001, "blocks"], [.75, "maze"], [.999999, "maze"]] as const)("assigns the equal-quarter bucket for %s to %s", (value, variant) => {
    expect(resolveHeroVariant("", () => value)).toBe(variant);
  });
  it.each(["?utm_source=newsletter", "?show=", "?show=unknown"])("samples the homepage pool for %s", search => {
    expect(resolveHeroVariant(search, () => .4)).toBe("balls");
  });
  it("samples again on every refresh instead of remembering the last choice", () => {
    const random = vi.fn().mockReturnValueOnce(.1).mockReturnValueOnce(.4).mockReturnValueOnce(.6).mockReturnValueOnce(.9);
    expect([resolveHeroVariant("", random), resolveHeroVariant("", random), resolveHeroVariant("", random),resolveHeroVariant("", random)]).toEqual(["rubik", "balls", "blocks","maze"]);
    expect(random).toHaveBeenCalledTimes(4);
  });
  it("opens the maze case-insensitively and wraps its Next button to Rubik",()=> {
    expect(resolveHeroVariant("?show=MAZE")).toBe("maze");
    expect(nextHeroVariant("maze")).toBe("rubik");
  });
  it("cycles Rubik, Balls, flat blocks, Maze, then Rubik; leaves the explicit 3D preview for Rubik", () => {
    expect(nextHeroVariant("rubik")).toBe("balls");
    expect(nextHeroVariant("balls")).toBe("blocks");
    expect(nextHeroVariant("blocks")).toBe("maze");
    expect(nextHeroVariant("3dBlocks")).toBe("rubik");
  });
});
