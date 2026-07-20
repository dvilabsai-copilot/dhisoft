'use client';

import { useEffect, useState } from 'react';

type CmsEditorProps = {
  role: 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';
};

type CmsHomeResponse = {
  key: string;
  version: number;
  publishedAt: string | null;
  content: unknown;
};

export default function CmsEditor({ role }: CmsEditorProps) {
  const [result, setResult] = useState<CmsHomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCmsContent(): Promise<void> {
      try {
        const response = await fetch('/api/admin/cms/home', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to load CMS content: ${response.status}`);
        }

        const data = (await response.json()) as CmsHomeResponse;

        if (!controller.signal.aborted) {
          setResult(data);
          setError('');
        }
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === 'AbortError'
        ) {
          return;
        }

        if (!controller.signal.aborted) {
          setError('Could not load CMS content.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCmsContent();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <p>Loading CMS content…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main>
      <h1>CMS Editor</h1>
      <p>Current role: {role}</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}