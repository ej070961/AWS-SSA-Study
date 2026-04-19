import { readFileSync } from "fs";
import { join } from "path";
import WrongList from "@/components/WrongList";
import { getWrongList } from "@/lib/notion";
import type { WrongEntry, Question } from "@/types";

export const revalidate = 0;

export default async function WrongPage() {
  let items: WrongEntry[] = [];
  let questionMap: Map<number, string> = new Map();

  try {
    const raw = readFileSync(join(process.cwd(), "public/questions.json"), "utf-8");
    const questions: Question[] = JSON.parse(raw);
    questionMap = new Map(questions.map((q) => [q.num, q.question]));
  } catch {}

  try {
    items = await getWrongList();
  } catch {}

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">오답 노트</h1>
        <p className="text-xs text-gray-500 mt-0.5">틀린 문제를 복습하세요</p>
      </div>
      <WrongList items={items} questionMap={Object.fromEntries(questionMap)} />
    </div>
  );
}
