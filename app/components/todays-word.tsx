"use client";

import { useState, useTransition } from "react";

import type { WordWithLineage } from "@/lib/queries";

import { receiveTodaysWord } from "../actions";
import { WordCard } from "./word-card";
import { WriteForm } from "./write-form";

export function TodaysWord({
  initialWord,
  allowReroll,
  alreadyWritten,
}: {
  initialWord: WordWithLineage | null;
  allowReroll: boolean;
  alreadyWritten: boolean;
}) {
  const [word, setWord] = useState(initialWord);
  const [error, setError] = useState<string | null>(null);
  const [justArrived, setJustArrived] = useState(false);
  const [pending, startTransition] = useTransition();

  function receive() {
    setError(null);
    startTransition(async () => {
      const result = await receiveTodaysWord();
      if (result.error) {
        setError(result.error);
        return;
      }
      setJustArrived(true);
      setWord(result.word ?? null);
    });
  }

  if (!word) {
    return (
      <div className="animate-fade-up flex flex-1 flex-col justify-center text-center">
        <ArrivingPoint />

        <p className="mt-10 text-sm leading-loose text-muted">
          今日のことづてが
          <br />
          あなたに届いています
        </p>

        {error && <p className="mt-6 text-xs text-accent">{error}</p>}

        <button
          onClick={receive}
          disabled={pending}
          className="mt-12 border border-line px-12 py-4 text-sm tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {pending ? "受け取っています…" : "受け取る"}
        </button>

        <p className="mt-6 text-xs text-faint">言葉が届くのは1日に1つだけです</p>
      </div>
    );
  }

  const written = alreadyWritten && !justArrived;

  return (
    <div>
      <WordCard word={word} animate={justArrived} />

      {/*
        書く欄は最初から開かない。開いていると「何か書かなければ」という圧が出る。
        受け取って読むだけで終われることが既定の状態であってほしい。
        別の言葉が届いたら作り直す(前の言葉に対する入力を残さない)。
      */}
      <div className="mt-8">
        <WriteForm
          key={word.id}
          wordId={word.id}
          defaultOpen={false}
          openLabel={written ? "もう一度書く" : "思ったことを書く"}
          note={
            written ? undefined : (
              <>
                書かなくても大丈夫です。
                <br />
                あとから、わたしの軌跡でも書けます。
              </>
            )
          }
        />
      </div>

      {allowReroll && (
        <button
          onClick={receive}
          disabled={pending}
          className="mx-auto mt-8 block text-xs tracking-widest text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent disabled:opacity-40"
        >
          {pending ? "…" : "もう一度受け取る(デモ用)"}
        </button>
      )}

      {error && <p className="mt-4 text-center text-xs text-accent">{error}</p>}
    </div>
  );
}

/**
 * 届こうとしている、ひとつの点。
 *
 * 封筒は使わない。ことづて(言伝)は口頭で人から人へ運ばれる言葉で、
 * 手紙でも郵便でもない。このプロダクトの視覚言語は紙ではなく、点と線。
 */
function ArrivingPoint() {
  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      <circle cx="40" cy="40" r="32" stroke="var(--line)" strokeWidth="1" />
      <circle
        cx="40"
        cy="40"
        r="18"
        stroke="var(--line)"
        strokeWidth="1"
        strokeDasharray="2.5 4"
      />
      <circle cx="40" cy="40" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
