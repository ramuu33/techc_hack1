import type { TraceEntry, TracePoint, Word } from "@/lib/queries";

import { EditableWord } from "./edit-form";
import { displayAuthor } from "./word-card";
import { WriteForm } from "./write-form";

/**
 * ④ 自分の軌跡。
 *
 * 届いた言葉が古い順に並ぶ。書いたものは点になっていて、
 * まだ書いていないものは余白のまま置かれている。
 * 埋まっていないことは失敗ではないので、件数バッジも催促も出さない。
 */
export function MyTrace({ entries }: { entries: TraceEntry[] }) {
  return (
    <ol className="space-y-14">
      {entries.map((entry, index) => (
        <li
          key={`${entry.received.id}-${entry.written?.id ?? "open"}`}
          className="animate-fade-up"
        >
          <Header
            index={index}
            date={entry.delivered_at}
            filled={entry.written !== null}
          />

          <Origin word={entry.received} />

          {entry.written ? (
            <EditableWord
              // 直したあとに作り直して、編集欄を畳む
              key={entry.written.text}
              wordId={entry.written.id}
              text={entry.written.text}
              delivered={entry.written_delivered}
            />
          ) : (
            <WriteForm
              wordId={entry.received.id}
              defaultOpen={false}
              openLabel="この言葉について書く"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

/** ⑤ 他の人の軌跡。書かれたものだけが古い順に並ぶ。 */
export function PublicTrace({ points }: { points: TracePoint[] }) {
  return (
    <ol className="space-y-14">
      {points.map((point, index) => (
        <li key={point.written.id} className="animate-fade-up">
          <Header index={index} date={point.written.created_at} filled />
          {point.origin && <Origin word={point.origin} />}
          <p className="mt-5 leading-loose tracking-wide">
            {point.written.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Header({
  index,
  date,
  filled,
}: {
  index: number;
  date: Date;
  filled: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`text-xs tracking-widest ${filled ? "text-accent" : "text-faint"}`}
      >
        {filled ? "●" : "○"}
        <span className="ml-2">{String(index + 1).padStart(2, "0")}</span>
      </span>
      <time dateTime={date.toISOString()} className="text-xs text-faint">
        {formatDate(date)}
      </time>
    </div>
  );
}

function Origin({ word }: { word: Word }) {
  return (
    <blockquote className="mt-4 border-l border-line pl-4">
      <p className="text-sm leading-loose text-muted">{word.text}</p>
      <p className="mt-2 text-xs text-faint">— {displayAuthor(word)}</p>
    </blockquote>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
}
