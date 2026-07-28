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
        <li key={entry.received.id} className="animate-fade-up">
          <Header
            index={index}
            date={entry.delivered_at}
            filled={entry.written.length > 0}
            suffix="に届いた"
          />

          <Origin word={entry.received} />

          {/* 同じ言葉に対して書いたものが、古い順に積まれていく */}
          {entry.written.map((entryWord) => (
            // 直したあとに作り直して、編集欄を畳む
            <div key={`${entryWord.word.id}-${entryWord.word.text}`}>
              <EditableWord
                wordId={entryWord.word.id}
                text={entryWord.word.text}
                delivered={entryWord.delivered}
                writtenAt={entryWord.written_at}
              />
              <BornFrom words={entryWord.children} />
            </div>
          ))}

          <WriteForm
            wordId={entry.received.id}
            defaultOpen={false}
            openLabel={
              entry.written.length > 0 ? "書き足す" : "この言葉について書く"
            }
          />
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
          <Header
            index={index}
            date={point.written.created_at}
            filled
            suffix="に書いた"
          />
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
  suffix,
}: {
  index: number;
  date: Date;
  filled: boolean;
  /** 自分の軌跡では届いた日、他の人の軌跡では書いた日を出している */
  suffix: string;
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
        {suffix}
      </time>
    </div>
  );
}

/**
 * ③' 自分の言葉から生まれた、他の人の言葉。
 *
 * 「◯人が受け取りました」は到達量だが、これは変化の証拠そのもの。
 * 返信ではない——書いた人はこちらに宛てておらず、こちらから返す手段もない。
 * ただ「自分の言葉が誰かの前提を動かした」という事実だけが返ってくる。
 * 件数は数えず、生まれた言葉そのものを見せる。
 */
function BornFrom({ words }: { words: Word[] }) {
  if (words.length === 0) return null;

  return (
    <div className="mt-4 border-l border-line pl-4">
      <p className="text-[0.7rem] tracking-wider text-accent">
        この言葉から、ことづてが生まれました
      </p>

      {words.map((word) => (
        <p key={word.id} className="mt-2 text-sm leading-loose text-muted">
          {word.text}
          <span className="ml-2 whitespace-nowrap text-xs text-faint">
            — {displayAuthor(word)}
          </span>
        </p>
      ))}
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
