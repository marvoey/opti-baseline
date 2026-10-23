'use client';

import { useEffect, useState } from 'react';

/** Client hook for the CMS 12 Content Delivery mock: GET /api/episerver/v3.0/content/{id}. */
export function useCmsContent(contentId?: string, expand: string = '*') {
  const [data, setData] = useState<unknown>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const key = contentId ? `${contentId}|${expand}` : null;

  useEffect(() => {
    if (!contentId) return;

    let isMounted = true;

    fetch(`/api/episerver/v3.0/content/${encodeURIComponent(contentId)}?expand=${encodeURIComponent(expand)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (isMounted) setLoadedKey(`${contentId}|${expand}`);
      });

    return () => {
      isMounted = false;
    };
  }, [contentId, expand]);

  // Loading until the request for the current (contentId, expand) has settled.
  return { data, isLoading: key !== null && loadedKey !== key, error };
}
