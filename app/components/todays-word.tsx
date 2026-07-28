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
      <div className="animate-fade-up pt-20 text-center">
        <div
          aria-hidden
          className="mx-auto h-14 w-20 border border-line bg-surface"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            backgroundImage:
              "linear-gradient(135deg, transparent 48%, var(--line) 48%, var(--line) 50%, transparent 50%), linear-gradient(-135deg, transparent 48%, var(--line) 48%, var(--line) 50%, transparent 50%)",
          }}
        />

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

      {/* 別の言葉が届いたら書く欄を作り直す(前の言葉に対する入力を残さない) */}
      <WriteForm
        key={word.id}
        wordId={word.id}
        defaultOpen={!written}
        openLabel="もう一度書く"
      />

      {!written && (
        <p className="mt-4 text-center text-xs leading-relaxed text-faint">
          いま書けなくても大丈夫です。わたしの軌跡から、あとで書けます。
        </p>
      )}

      {allowReroll && (
        <button
          onClick={receive}
          disabled={pending}
          className="mt-8 w-full text-xs tracking-widest text-faint transition-colors hover:text-muted disabled:opacity-40"
        >
          {pending ? "…" : "もう一度受け取る(デモ用)"}
        </button>
      )}

      {error && <p className="mt-4 text-center text-xs text-accent">{error}</p>}
    </div>
  );
}
