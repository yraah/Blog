// hooks/useFetch.ts
// Reusable hook that eliminates the repeated loading/error/data pattern
// found in DashboardContent, CategoryTable, PostsTable, etc.

import { useState, useEffect, useCallback } from "react";
import { formatError } from "@/utils/error";
import { withRetry } from "@/utils/retry";

type UseFetchState<T> = {
  data:    T | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
};

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps:    unknown[] = []
): UseFetchState<T> {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await withRetry(fetcher);
      setData(result);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}
