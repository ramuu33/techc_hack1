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
        <Envelope />

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
        />

        {!written && (
          <p className="mt-5 text-center text-xs leading-relaxed text-faint">
            書かなくても大丈夫です。
            <br />
            あとから、わたしの軌跡でも書けます。
          </p>
        )}
      </div>

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

/**
 * 封筒。フタの線だけを引く。
 * 対角線を2本引くと×印になり、壊れた画像のように見えてしまう。
 */
function Envelope() {
  return (
    <svg
      viewBox="0 0 40 28"
      width="80"
      height="56"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mx-auto text-line"
    >
      <rect x="0.45" y="0.45" width="39.1" height="27.1" rx="1.5" />
      <path d="M1.6 1.9 L20 15.2 L38.4 1.9" />
    </svg>
  );
}
