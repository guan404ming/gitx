"use client";

import { useCallback, useRef, useEffect } from "react";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/date-range-picker";
import { AddRepo } from "@/components/add-repo";
import { RepoCard } from "@/components/repo-card";
import { useRepos } from "@/hooks/use-repos";
import { useStats } from "@/hooks/use-stats";
import { CONFIG } from "@/lib/config";

export default function Home() {
  const { repos, ready, addRepo, removeRepo } = useRepos();
  const { stats, loading, fetchStats } = useStats();
  const rangeRef = useRef<{ start: string; end: string } | null>(null);
  const autoFetched = useRef(false);

  // Auto-fetch "This Week" once repos are loaded
  useEffect(() => {
    if (ready && !autoFetched.current && repos.length > 0) {
      autoFetched.current = true;
      const now = new Date();
      const start = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const end = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
      rangeRef.current = { start, end };
      fetchStats(repos, start, end);
    }
  }, [ready, repos, fetchStats]);

  const handleRangeChange = useCallback(
    (start: string, end: string) => {
      rangeRef.current = { start, end };
      fetchStats(repos, start, end);
    },
    [repos, fetchStats]
  );

  const handleAddRepo = useCallback(
    (input: string) => {
      addRepo(input);
      if (rangeRef.current) {
        const { start, end } = rangeRef.current;
        let repo = input.trim();
        try {
          const url = new URL(repo);
          const parts = url.pathname.split("/").filter(Boolean);
          if (parts.length >= 2) repo = `${parts[0]}/${parts[1]}`;
        } catch {
          // already owner/repo
        }
        if (repo.includes("/") && !repos.includes(repo)) {
          fetchStats([...repos, repo], start, end);
        }
      }
    },
    [addRepo, repos, fetchStats]
  );

  const handleRemove = useCallback(
    (repo: string) => {
      removeRepo(repo);
      if (rangeRef.current) {
        const { start, end } = rangeRef.current;
        fetchStats(
          repos.filter((r) => r !== repo),
          start,
          end
        );
      }
    },
    [removeRepo, repos, fetchStats]
  );

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">GitX</h1>
        <p className="text-muted-foreground text-sm">
          Contribution dashboard for <code>{CONFIG.username}</code>
        </p>
      </div>

      <div className="space-y-4">
        <DateRangePicker onRangeChange={handleRangeChange} />
        <AddRepo onAdd={handleAddRepo} />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching...
        </div>
      )}

      {stats.length > 0 && rangeRef.current && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <RepoCard
              key={s.repo}
              stat={s}
              start={rangeRef.current!.start}
              end={rangeRef.current!.end}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {!loading && stats.length === 0 && repos.length > 0 && !rangeRef.current && (
        <p className="text-sm text-muted-foreground">
          Select a time range to fetch stats.
        </p>
      )}
    </main>
  );
}
