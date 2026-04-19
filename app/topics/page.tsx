"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROADMAP } from "@/lib/roadmap";

const DOMAIN_LABELS = ["Security", "Media", "Design", "Cost"];

export default function TopicsPage() {
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes/list")
      .then((r) => r.json())
      .then((topics: string[]) => {
        setSavedTopics(topics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalTopics = ROADMAP.flatMap((p) => p.topics).length;
  const completedCount = ROADMAP.flatMap((p) => p.topics).filter((t) =>
    savedTopics.includes(t.name)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">토픽 목록</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "로딩 중..." : `${completedCount} / ${totalTopics} 학습 완료`}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          노트 저장된 토픽 = ✅
        </div>
      </div>

      {ROADMAP.map((phase) => {
        const phaseCompleted = phase.topics.filter((t) =>
          savedTopics.includes(t.name)
        ).length;

        return (
          <div key={phase.phase} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: phase.color + "15" }}
            >
              <div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  Phase {phase.phase}
                </span>
                <span className="ml-2 font-semibold text-gray-800">{phase.title}</span>
              </div>
              <span className="text-xs text-gray-500">
                {loading ? "-" : `${phaseCompleted}/${phase.topics.length}`}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {phase.topics.map((topic) => {
                const saved = savedTopics.includes(topic.name);
                return (
                  <Link
                    key={topic.name}
                    href={`/notes/${encodeURIComponent(topic.name)}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: phase.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm">{topic.name}</p>
                        <p className="text-xs text-gray-400 truncate">{topic.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {DOMAIN_LABELS[topic.domainIndex]}
                      </span>
                      {!loading && (
                        <span className="text-base">{saved ? "✅" : "○"}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
