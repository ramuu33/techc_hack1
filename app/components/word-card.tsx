import { summarizeLineage } from "@/lib/lineage";
import type { Word, WordWithLineage } from "@/lib/queries";

/** ユーザーの言葉には「さん」を付け、偉人はそのまま呼ぶ。 */
export function displayAuthor(word: Word) {
  return word.source_type === "user" ? `${word.author}さん` : word.author;
}

/**
 * 短い箴言は大きく、長い述懐は小さく組む。
 * 偉人の言葉は一行で終わることが多く、ユーザーの言葉は数行になることが多い。
 * 同じ級数で組むと後者が画面を埋め尽くし、下にある「◯人が受け取りました」が隠れる。
 */
function scaleFor(text: string) {
  if (text.length <= 45) return "text-[1.35rem] leading-[2.2]";
  if (text.length <= 110) return "text-[1.1rem] leading-[2.1]";
  return "text-[1rem] leading-[2]";
}

export function WordCard({
  word,
  animate = false,
}: {
  word: WordWithLineage;
  animate?: boolean;
}) {
  const parent = word.lineage.at(-2) ?? null;

  return (
    <article
      className={`rounded-sm border border-line bg-surface px-7 py-10 shadow-[0_1px_0_rgba(0,0,0,0.02)] ${
        animate ? "animate-arrive" : ""
      }`}
    >
      <p className={`${scaleFor(word.text)} tracking-wide`}>{word.text}</p>

      <p className="mt-7 text-right text-sm text-muted">— {word.author}</p>

      {word.source && (
        <p className="mt-1 text-right text-xs text-faint">
          {word.source_url ? (
            <a
              href={word.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-muted"
            >
              {word.source}
            </a>
          ) : (
            word.source
          )}
        </p>
      )}

      {word.original && (
        <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-faint">
          {word.original}
          {word.translation_note && `(${word.translation_note})`}
        </p>
      )}

      {parent && <Provenance word={word} parent={parent} lineage={word.lineage} />}
    </article>
  );
}

/**
 * 来歴。この言葉が何から生まれたかを、受け取る瞬間に見せる。
 * 循環を体験可能にする中核の演出。
 */
function Provenance({
  word,
  parent,
  lineage,
}: {
  word: Word;
  parent: Word;
  lineage: Word[];
}) {
  return (
    <div className="mt-8 border-t border-line pt-5">
      <p className="text-xs leading-relaxed text-muted">
        この言葉は、{displayAuthor(word)}が{displayAuthor(parent)}
        の言葉に触れて書いたものです
      </p>

      {/* 来歴は循環を見せる中核の情報なので、補助テキストより読める濃さにする */}
      <blockquote className="mt-3 border-l border-line pl-4 text-xs leading-relaxed text-muted">
        {parent.text}
      </blockquote>

      {lineage.length > 2 && (
        <p className="mt-4 text-[0.7rem] tracking-wider text-muted">
          {summarizeLineage(lineage.map((link) => link.author))}
        </p>
      )}
    </div>
  );
}
