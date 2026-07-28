"use client";

import { useActionState, useState } from "react";

import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "@/lib/constants";

import { writeWord, type ActionState } from "../actions";

/**
 * ② 心が動いたことを書く。
 *
 * 今日届いた言葉にも、前に届いた言葉にも同じものを使う。
 * 言葉が届いた瞬間と、前提が動く瞬間は同じとは限らないため、
 * あとから書けることは例外ではなく通常の経路として扱う。
 */
export function WriteForm({
  wordId,
  defaultOpen = true,
  openLabel = "書く",
  label = "心が動いたら、書き残す",
}: {
  wordId: string;
  defaultOpen?: boolean;
  openLabel?: string;
  label?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    writeWord,
    {},
  );
  const [open, setOpen] = useState(defaultOpen);

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
        className="mt-5 text-xs tracking-widest text-faint transition-colors hover:text-accent"
      >
        {openLabel}
      </button>
    );
  }

  return (
    <form action={action} className="animate-fade-up mt-8">
      <input type="hidden" name="parentWordId" value={wordId} />

      <label
        htmlFor={`text-${wordId}`}
        className="block text-xs tracking-widest text-faint"
      >
        {label}
      </label>

      <textarea
        id={`text-${wordId}`}
        name="text"
        rows={4}
        minLength={MIN_WORD_LENGTH}
        maxLength={MAX_WORD_LENGTH}
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
