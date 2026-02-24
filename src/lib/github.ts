import { CONFIG } from "@/lib/config";

export interface RepoStats {
  repo: string;
  merged: number;
  reviewed: number;
}

export interface PullRequest {
  title: string;
  number: number;
  html_url: string;
  created_at: string;
  closed_at: string;
  user: { login: string; avatar_url: string };
}

async function searchCount(query: string): Promise<number> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total_count ?? 0;
}

export async function searchPRs(
  query: string
): Promise<PullRequest[]> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated&order=desc`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).map((item: Record<string, unknown>) => ({
    title: item.title,
    number: item.number,
    html_url: item.html_url,
    created_at: item.created_at,
    closed_at: item.closed_at,
    user: item.user,
  }));
}

export async function fetchRepoStats(
  repo: string,
  start: string,
  end: string
): Promise<RepoStats> {
  const [merged, reviewed] = await Promise.all([
    searchCount(
      `repo:${repo} author:${CONFIG.username} is:pr is:merged merged:${start}..${end}`
    ),
    searchCount(
      `repo:${repo} reviewed-by:${CONFIG.username} is:pr is:merged merged:${start}..${end} -author:${CONFIG.username}`
    ),
  ]);
  return { repo, merged, reviewed };
}
