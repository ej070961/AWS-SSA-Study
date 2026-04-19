import { NextRequest, NextResponse } from "next/server";
import { getWrongList, updateReviewed } from "@/lib/notion";

export async function GET() {
  const list = await getWrongList();
  return NextResponse.json(list);
}

export async function PATCH(req: NextRequest) {
  const { notionPageId, reviewed } = await req.json();
  await updateReviewed(notionPageId, reviewed);
  return NextResponse.json({ success: true });
}
