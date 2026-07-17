import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultHomeContent } from '@/content/default-home-content';
import { getHomeContent } from '@/lib/cms-api';
import { getCmsIcon } from '@/lib/icon-map';
import { activeSorted, isHomeContent, isPublicHomeResponse } from '@/types/cms';

describe('CMS contract boundary', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts the typed fallback and the expected response shape', () => {
    expect(isHomeContent(defaultHomeContent)).toBe(true);
    expect(isPublicHomeResponse({ key: 'home', version: 1, publishedAt: null, content: defaultHomeContent })).toBe(true);
  });

  it('rejects unsafe CMS links and assets', () => {
    const invalid = structuredClone(defaultHomeContent);
    invalid.navigation.links[0].href = 'javascript:alert(1)';
    expect(isHomeContent(invalid)).toBe(false);
  });

  it('filters and sorts without mutating the API array', () => {
    const items = [{ sortOrder: 20, isActive: true }, { sortOrder: 10, isActive: false }, { sortOrder: 5, isActive: true }];
    const sorted = activeSorted(items);
    expect(sorted.map((item) => item.sortOrder)).toEqual([5, 20]);
    expect(items.map((item) => item.sortOrder)).toEqual([20, 10, 5]);
  });

  it('uses the safe icon fallback for unknown keys', () => {
    expect(getCmsIcon('unknown-from-cms')).toBe(getCmsIcon('Sparkles'));
  });

  it('returns fallback content when the CMS fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(getHomeContent()).resolves.toEqual(defaultHomeContent);
  });
});
