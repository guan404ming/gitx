"use client";

import { useState, useCallback } from "react";
import type { RepoStats } from "@/lib/github";

export function useStats() {
  const [stats, setStats] = useState<RepoStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(
    async (repos: string[], start: string, end: string) => {
      if (repos.length === 0) {
        setStats([]);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({
          repos: repos.join(","),
          start,
          end,
        });
        const res = await fetch(`/api/stats?${params}`);
        if (res.ok) {
          setStats(await res.json());
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { stats, loading, fetchStats };
}
