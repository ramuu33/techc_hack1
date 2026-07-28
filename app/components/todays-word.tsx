"use client";

import { useActionState, useState, useTransition } from "react";

import type { WordWithLineage } from "@/lib/queries";

import {
  receiveTodaysWord,
  writeWord,
  type ActionState,
} from "../actions";
import { WordCard } from "./word-card";

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

  return (
    <div>
      <WordCard word={word} animate={justArrived} />

      {/* 別の言葉が届いたら書く欄を作り直す(前の言葉に対する入力を残さない) */}
      <WriteForm
        key={word.id}
        wordId={word.id}
        alreadyWritten={alreadyWritten && !justArrived}
      />

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

/** ② 心が動いたことを書く。 */
function WriteForm({
  wordId,
  alreadyWritten,
}: {
  wordId: string;
  alreadyWritten: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    writeWord,
    {},
  );
  const [open, setOpen] = useState(!alreadyWritten);

  if (state.ok) {
    return (
      <p className="animate-fade-up mt-10 text-center text-sm leading-loose text-accent">
        ことづてを託しました。
        <br />
        <span className="text-muted">
          この言葉は、明日から誰かのもとに届きます。
        </span>
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-10 w-full text-xs tracking-widest text-faint transition-colors hover:text-muted"
      >
        もう一度書く
      </button>
    );
  }

  return (
    <form action={action} className="animate-fade-up mt-12">
      <input type="hidden" name="parentWordId" value={wordId} />

      <label htmlFor="text" className="block text-xs tracking-widest text-faint">
        心が動いたら、書き残す
      </label>

      <textarea
        id="text"
        name="text"
        rows={4}
        maxLength={500}
        required
        placeholder="この言葉を読んで、自分が何に気づいたか"
        className="mt-3 w-full resize-none border-b border-line bg-transparent py-3 leading-loose outline-none placeholder:text-faint focus:border-accent"
      />

      {state.error && <p className="mt-3 text-xs text-accent">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full border border-line py-4 text-sm tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        {pending ? "託しています…" : "ことづてを託す"}
      </button>
    </form>
  );
}
