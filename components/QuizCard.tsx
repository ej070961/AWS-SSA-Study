"use client";

import type { Question, OptionKey } from "@/types";

type Props = {
  question: Question;
  current: number;
  total: number;
  selected: OptionKey | null;
  revealed: boolean;
  onSelect: (key: OptionKey) => void;
  onReveal: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function QuizCard({
  question,
  current,
  total,
  selected,
  revealed,
  onSelect,
  onReveal,
  onNext,
  onSkip,
}: Props) {
  const optionKeys = Object.keys(question.options) as OptionKey[];

  function getOptionStyle(key: OptionKey) {
    if (!revealed) {
      return selected === key
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-gray-400";
    }
    if (key === question.answer) return "border-green-500 bg-green-50 text-green-800";
    if (key === selected && selected !== question.answer)
      return "border-red-400 bg-red-50 text-red-800";
    return "border-gray-200 text-gray-500";
  }

  const isCorrect = revealed && selected === question.answer;
  const isWrong = revealed && selected !== question.answer;

  return (
    <div className="flex flex-col gap-4">
      {/* 진행률 */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Q.{question.num}</span>
        <span>{current} / {total}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full">
        <div
          className="h-1.5 bg-blue-500 rounded-full transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>

      {/* 문제 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
          {question.question}
        </p>
      </div>

      {/* 선지 */}
      <div className="flex flex-col gap-2">
        {optionKeys.map((key) => (
          <button
            key={key}
            onClick={() => !revealed && onSelect(key)}
            disabled={revealed}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${getOptionStyle(key)}`}
          >
            <span className="font-bold mr-2">{key}.</span>
            {question.options[key]}
          </button>
        ))}
      </div>

      {/* 결과 배지 */}
      {revealed && (
        <div className={`text-center text-sm font-semibold py-2 rounded-xl ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isCorrect ? "✅ 정답!" : `❌ 오답 — 정답은 ${question.answer}`}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2">
        {!revealed ? (
          <>
            <button
              onClick={onReveal}
              disabled={!selected}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-40 active:bg-blue-700"
            >
              정답 확인
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm"
            >
              건너뜀
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-semibold active:bg-gray-900"
          >
            다음 문제 →
          </button>
        )}
      </div>
    </div>
  );
}
