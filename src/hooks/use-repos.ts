"use client";

import { useState, useEffect, useCallback } from "react";
import { CONFIG } from "@/lib/config";

const STORAGE_KEY = "gitx-repos";

export function useRepos() {
  const [repos, setRepos] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRepos(JSON.parse(stored));
      } catch {
        setRepos(CONFIG.defaultRepos);
      }
    } else {
      setRepos(CONFIG.defaultRepos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CONFIG.defaultRepos));
    }
    setReady(true);
  }, []);

  const save = useCallback((next: string[]) => {
    setRepos(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addRepo = useCallback(
    (input: string) => {
      let repo = input.trim();
      try {
        const url = new URL(repo);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) repo = `${parts[0]}/${parts[1]}`;
      } catch {
        // already owner/repo format
      }
      if (!repo.includes("/")) return;
      if (repos.includes(repo)) return;
      save([...repos, repo]);
    },
    [repos, save]
  );

  const removeRepo = useCallback(
    (repo: string) => {
      save(repos.filter((r) => r !== repo));
    },
    [repos, save]
  );

  return { repos, ready, addRepo, removeRepo };
}
