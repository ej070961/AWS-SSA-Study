"use client";

import { useState } from "react";
import Link from "next/link";
import type { RoadmapPhase as RoadmapPhaseType } from "@/types";

type Props = {
  phase: RoadmapPhaseType;
  savedTopics: string[];
};

export default function RoadmapPhase({ phase, savedTopics }: Props) {
  const [open, setOpen] = useState(true);
  const done = phase.topics.filter((t) => savedTopics.includes(t.name)).length;
  const pct = Math.round((done / phase.topics.length) * 100);

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* 헤더 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: phase.color }}
          >
            {phase.phase}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{phase.title}</p>
            <p className="text-xs text-gray-500">{phase.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{done}/{phase.topics.length}</span>
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* 진행률 바 */}
      <div className="mx-5 h-1 bg-gray-100 rounded-full mb-1">
        <div
          className="h-1 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: phase.color }}
        />
      </div>

      {/* 토픽 목록 */}
      {open && (
        <div className="px-5 pb-4 pt-3 flex flex-wrap gap-2">
          {phase.topics.map((topic) => {
            const saved = savedTopics.includes(topic.name);
            return (
              <Link
                key={topic.name}
                href={`/notes/${encodeURIComponent(topic.name)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  saved
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {saved && "✓ "}{topic.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
