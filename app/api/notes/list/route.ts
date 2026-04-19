import { NextResponse } from "next/server";
import { getNoteTopics } from "@/lib/notion";

export async function GET() {
  const topics = await getNoteTopics();
  return NextResponse.json(topics);
}
