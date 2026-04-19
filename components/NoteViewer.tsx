"use client";

import type { ContentBlock, NoteResponse } from "@/types";

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-pink-600">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    )
  );
}

function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <pre key={i} className="mt-2 bg-gray-900 rounded-lg p-3 overflow-x-auto text-xs">
            <code className="text-green-300 font-mono">{block.text}</code>
          </pre>
        ) : (
          <p key={i} className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap first:mt-0">
            {renderInlineCode(block.text)}
          </p>
        )
      )}
    </>
  );
}

type Props = { note: NoteResponse };

export default function NoteViewer({ note }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">{note.topic}</h1>
          <a
            href={note.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Notion ↗
          </a>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
            {note.domain}
          </span>
          <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
            {note.status}
          </span>
        </div>
        {note.summary && (
          <p className="mt-3 text-sm text-gray-600">{note.summary}</p>
        )}
      </div>

      {note.content.map((section, i) => {
        const hasContent = section.blocks.length > 0 || section.subsections.length > 0;
        if (!hasContent) return null;
        return (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-3">{section.title}</h2>
            <Blocks blocks={section.blocks} />
            {section.subsections.map((sub, j) => (
              <div key={j} className="mt-3 pl-3 border-l-2 border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{sub.title}</h3>
                <Blocks blocks={sub.blocks} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
