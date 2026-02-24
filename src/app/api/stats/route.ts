import { NextRequest, NextResponse } from "next/server";
import { fetchRepoStats } from "@/lib/github";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const repos = searchParams.get("repos");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!repos || !start || !end) {
    return NextResponse.json(
      { error: "Missing repos, start, or end" },
      { status: 400 }
    );
  }

  const repoList = repos.split(",").map((r) => r.trim());
  const results = await Promise.all(
    repoList.map((repo) => fetchRepoStats(repo, start, end))
  );

  return NextResponse.json(results);
}
