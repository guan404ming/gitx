import { NextRequest, NextResponse } from "next/server";
import { searchPRs } from "@/lib/github";
import { CONFIG } from "@/lib/config";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const repo = searchParams.get("repo");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const type = searchParams.get("type"); // "merged" | "reviewed"

  if (!repo || !start || !end || !type) {
    return NextResponse.json(
      { error: "Missing repo, start, end, or type" },
      { status: 400 }
    );
  }

  const query =
    type === "merged"
      ? `repo:${repo} author:${CONFIG.username} is:pr is:merged base:main merged:${start}..${end}`
      : `repo:${repo} reviewed-by:${CONFIG.username} is:pr is:merged base:main merged:${start}..${end} -author:${CONFIG.username}`;

  const prs = await searchPRs(query);
  return NextResponse.json(prs);
}
