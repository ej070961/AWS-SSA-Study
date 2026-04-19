"use client";

import { useState } from "react";
import Link from "next/link";
import type { WrongEntry } from "@/types";

type Props = { items: WrongEntry[]; questionMap: Record<number, string> };

export default function WrongList({ items, questionMap }: Props) {
  const [list, setList] = useState(items);

  const total = list.length;
  const reviewed = list.filter((i) => i.reviewed).length;
  const pending = total - reviewed;

  async function toggleReviewed(item: WrongEntry) {
    const next = !item.reviewed;
    await fetch("/api/wrong", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notionPageId: item.notionPageId, reviewed: next }),
    });
    setList((prev) =>
      prev.map((i) => (i.notionPageId === item.notionPageId ? { ...i, reviewed: next } : i))
    );
  }

  return (
    <div className="space-y-4">
      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "누적 오답", value: total, color: "text-gray-800" },
          { label: "복습 완료", value: reviewed, color: "text-green-600" },
          { label: "복습 대기", value: pending, color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* 오답 카드 목록 */}
      {list.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-12">아직 오답이 없어요 🎉</p>
      )}
      {list.map((item) => {
        const fullQuestion = questionMap[item.questionNum];
        return (
          <div key={item.notionPageId} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-gray-500">Q.{item.questionNum}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  item.reviewed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}
              >
                {item.reviewed ? "복습완료" : "복습대기"}
              </span>
            </div>

            <p className="text-sm text-gray-800 mb-3 leading-snug">
              {fullQuestion ?? item.question}
            </p>

            <div className="flex gap-2 text-xs mb-3">
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg">내 답: {item.myAnswer.split(".")[0]}</span>
            </div>

            {item.keyConcept && (
              <p className="text-xs text-blue-600 mb-2">💡 {item.keyConcept}</p>
            )}
            {item.explanation && (
              <p className="text-xs text-gray-500 leading-relaxed mb-3 whitespace-pre-wrap">{item.explanation}</p>
            )}

            <div className="flex gap-2">
              <Link
                href={`/?q=${item.questionNum}`}
                className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs text-gray-600"
              >
                다시 풀기
              </Link>
              <a
                href={`https://www.notion.so/${item.notionPageId.replace(/-/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-xl border border-blue-200 text-xs text-blue-600"
              >
                오답노트 ↗
              </a>
              <button
                onClick={() => toggleReviewed(item)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                  item.reviewed ? "bg-gray-100 text-gray-500" : "bg-green-600 text-white"
                }`}
              >
                {item.reviewed ? "복습 취소" : "복습 완료"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
