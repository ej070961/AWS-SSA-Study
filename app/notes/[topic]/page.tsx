import Link from "next/link";
import NoteViewer from "@/components/NoteViewer";
import { getNoteByTopic } from "@/lib/notion";
import { ROADMAP } from "@/lib/roadmap";

export const revalidate = 3600;

type Props = { params: Promise<{ topic: string }> };

export default async function NotePage({ params }: Props) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);

  let note = null;
  try {
    note = await getNoteByTopic(decoded);
  } catch {
    // Notion API 오류 시 404
  }

  // 로드맵에서 다음 추천 토픽 찾기
  const roadmapTopic = ROADMAP.flatMap((p) => p.topics).find((t) => t.name === decoded);
  const nextTopics = roadmapTopic?.next ?? [];

  return (
    <div className="space-y-4">
      <Link href="/roadmap" className="text-xs text-blue-500 flex items-center gap-1">
        ← 로드맵으로
      </Link>

      {note ? (
        <>
          <NoteViewer note={note} />
          {nextTopics.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-2">다음 추천 토픽</p>
              <div className="flex gap-2 flex-wrap">
                {nextTopics.map((t) => (
                  <Link
                    key={t}
                    href={`/notes/${encodeURIComponent(t)}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {t} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center space-y-3">
          <p className="text-3xl">📭</p>
          <p className="font-semibold text-gray-800">{decoded}</p>
          <p className="text-sm text-gray-500">아직 학습 노트가 없어요.</p>

        </div>
      )}
    </div>
  );
}
