"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, GitMerge, Eye, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import type { PullRequest, RepoStats } from "@/lib/github";

export default function RepoDetailPage({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}) {
  const { owner, name } = use(params);
  const repo = `${owner}/${name}`;

  const [allTimeStats, setAllTimeStats] = useState<RepoStats | null>(null);
  const [mergedPRs, setMergedPRs] = useState<PullRequest[]>([]);
  const [reviewedPRs, setReviewedPRs] = useState<PullRequest[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPRs, setLoadingPRs] = useState(false);

  // Fetch all-time stats on mount
  useEffect(() => {
    async function fetchAllTime() {
      const now = new Date().toISOString().split("T")[0];
      const res = await fetch(
        `/api/stats?repos=${repo}&start=2008-01-01&end=${now}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setAllTimeStats(data[0]);
      }
      setLoadingStats(false);
    }
    fetchAllTime();
  }, [repo]);

  const handleRangeChange = useCallback(
    async (start: string, end: string) => {
      setLoadingPRs(true);
      const [merged, reviewed] = await Promise.all([
        fetch(`/api/prs?repo=${repo}&start=${start}&end=${end}&type=merged`).then((r) => r.json()),
        fetch(`/api/prs?repo=${repo}&start=${start}&end=${end}&type=reviewed`).then((r) => r.json()),
      ]);
      setMergedPRs(merged);
      setReviewedPRs(reviewed);
      setLoadingPRs(false);
    },
    [repo]
  );

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{repo}</h1>
      </div>

      {/* All-time stats */}
      {loadingStats ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading stats...
        </div>
      ) : allTimeStats && (
        <Card>
          <CardContent className="flex gap-8 pt-6">
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <GitMerge className="h-3.5 w-3.5" />
                Total Merged
              </div>
              <p className="text-3xl font-bold tracking-tight">{allTimeStats.merged}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Eye className="h-3.5 w-3.5" />
                Total Reviewed
              </div>
              <p className="text-3xl font-bold tracking-tight">{allTimeStats.reviewed}</p>
            </div>
            <div className="ml-auto self-center">
              <Badge variant="secondary">All Time</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time range picker for PR list */}
      <DateRangePicker onRangeChange={handleRangeChange} />

      {loadingPRs && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading PRs...
        </div>
      )}

      {!loadingPRs && (mergedPRs.length > 0 || reviewedPRs.length > 0) && (
        <div className="space-y-8">
          <PRSection
            title="Merged PRs"
            icon={<GitMerge className="h-4 w-4" />}
            prs={mergedPRs}
          />
          <PRSection
            title="Reviewed PRs"
            icon={<Eye className="h-4 w-4" />}
            prs={reviewedPRs}
          />
        </div>
      )}
    </main>
  );
}

function PRSection({
  title,
  icon,
  prs,
}: {
  title: string;
  icon: React.ReactNode;
  prs: PullRequest[];
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
        <Badge variant="secondary">{prs.length}</Badge>
      </h2>
      {prs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No PRs found.</p>
      ) : (
        <ul className="space-y-2">
          {prs.map((pr) => (
            <li key={pr.number}>
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm">{pr.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    #{pr.number} by {pr.user.login}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
