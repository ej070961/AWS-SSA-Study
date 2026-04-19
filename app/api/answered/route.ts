import { NextResponse } from "next/server";
import { getAnsweredQuestions } from "@/lib/notion";

export async function GET() {
  const answered = await getAnsweredQuestions();
  return NextResponse.json(answered);
}
