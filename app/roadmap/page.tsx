import RoadmapPhase from "@/components/RoadmapPhase";
import { ROADMAP, ALL_TOPICS } from "@/lib/roadmap";
import { getNoteTopics } from "@/lib/notion";

export const revalidate = 3600;

export default async function RoadmapPage() {
  let savedTopics: string[] = [];
  try {
    savedTopics = await getNoteTopics();
  } catch {
    // Notion API 미설정 시 빈 배열로 폴백
  }

  const total = ALL_TOPICS.length;
  const done = ALL_TOPICS.filter((t) => savedTopics.includes(t)).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">학습 로드맵</h1>
        <p className="text-xs text-gray-500 mt-0.5">AWS SAA-C03 Phase 1~6</p>
      </div>

      {/* 전체 진행률 */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">전체 진행률</span>
          <span className="text-blue-600 font-bold">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{done} / {total} 토픽 완료</p>
      </div>

      {ROADMAP.map((phase) => (
        <RoadmapPhase key={phase.phase} phase={phase} savedTopics={savedTopics} />
      ))}
    </div>
  );
}
