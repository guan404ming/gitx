"use client";

import Link from "next/link";
import { X, GitMerge, Eye, GitPullRequest } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RepoStats } from "@/lib/github";
import { CONFIG } from "@/lib/config";

function RepoIcon({ repo }: { repo: string }) {
  const [owner] = repo.split("/");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://github.com/${owner}.png?size=64`}
      alt={repo}
      width={32}
      height={32}
      className="rounded shrink-0"
    />
  );
}

interface RepoCardProps {
  stat: RepoStats;
  start: string;
  end: string;
  onRemove: (repo: string) => void;
}

export function RepoCard({ stat, start, end, onRemove }: RepoCardProps) {
  const [owner, name] = stat.repo.split("/");
  const isDefault = CONFIG.defaultRepos.includes(stat.repo);

  return (
    <Link href={`/repo/${owner}/${name}?start=${start}&end=${end}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 min-w-0">
            <RepoIcon repo={stat.repo} />
            <div className="min-w-0">
              <p className="text-base font-semibold truncate">{name}</p>
              <p className="text-xs text-muted-foreground truncate">{owner}</p>
            </div>
          </CardTitle>
          {!isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onRemove(stat.repo);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <GitMerge className="h-3.5 w-3.5 text-[#8250df] dark:text-[#a371f7]" />
              Merged
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.merged}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <GitPullRequest className="h-3.5 w-3.5 text-[#1a7f37] dark:text-[#3fb950]" />
              Opened
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.opened}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Eye className="h-3.5 w-3.5" />
              Reviewed
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.reviewed}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
