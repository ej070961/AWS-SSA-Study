"use client";

type Props = {
  keyConcept: string;
  explanation: string;
  loading?: boolean;
};

export default function ExplanationBox({ keyConcept, explanation, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
      {keyConcept && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            핵심 개념
          </p>
          <p className="text-sm font-semibold text-gray-800">{keyConcept}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          해설
        </p>
        {explanation ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            해설 준비 중 — Claude 채팅에서 이 문제 해설을 Notion에 저장하면 여기에 표시돼요.
          </p>
        )}
      </div>
    </div>
  );
}
