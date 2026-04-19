"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Question } from "@/types";

type Filter = "all" | "correct" | "wrong" | "unanswered";

type AnsweredEntry = { questionNum: number; status: string };

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statusMap, setStatusMap] = useState<Map<number, string>>(new Map());
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/questions").then((r) => r.json()),
      fetch("/api/answered").then((r) => r.json()),
    ]).then(([qs, answered]: [Question[], AnsweredEntry[]]) => {
      setQuestions(qs.filter((q) => q.answer !== ""));
      setStatusMap(new Map(answered.map((a) => [a.questionNum, a.status])));
      setLoading(false);
    });
  }, []);

  const correctCount = [...statusMap.values()].filter((s) => s === "정답").length;
  const wrongCount = [...statusMap.values()].filter((s) => s === "오답").length;
  const unansweredCount = questions.filter((q) => !statusMap.has(q.num)).length;

  const filtered = questions.filter((q) => {
    if (filter === "correct") return statusMap.get(q.num) === "정답";
    if (filter === "wrong") return statusMap.get(q.num) === "오답";
    if (filter === "unanswered") return !statusMap.has(q.num);
    return true;
  });

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: `전체 (${questions.length})` },
    { key: "correct", label: `정답 (${correctCount})` },
    { key: "wrong", label: `오답 (${wrongCount})` },
    { key: "unanswered", label: `미풀기 (${unansweredCount})` },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">문제 목록</h1>
        <p className="text-sm text-gray-500 mt-0.5">문제를 눌러 해당 문제로 바로 이동</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-20">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-20">해당 문제가 없어요</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => {
            const status = statusMap.get(q.num);
            return (
              <Link
                key={q.num}
                href={`/?q=${q.num}`}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
              >
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    status === "정답"
                      ? "bg-green-100 text-green-600"
                      : status === "오답"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {q.num}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 line-clamp-2 leading-snug">{q.question}</p>
                  {status && (
                    <span
                      className={`mt-1 inline-block text-[10px] font-semibold ${
                        status === "정답" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {status}
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 text-gray-300 text-sm">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
