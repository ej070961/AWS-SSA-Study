import { NextRequest, NextResponse } from "next/server";
import { getNoteByTopic } from "@/lib/notion";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });

  const note = await getNoteByTopic(topic);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(note);
}
