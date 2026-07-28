"use client";

import { useActionState, useState } from "react";

import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "@/lib/constants";

import { editWord, type ActionState } from "../actions";

/**
 * 書いた言葉を直す。
 *
 * 直せるのはまだ誰にも届いていないうちだけ。届いた後は、
 * その言葉を読んで書いた人の言葉の親が変わってしまうため閉じる。
 */
export function EditableWord({
  wordId,
  text,
  delivered,
}: {
  wordId: string;
  text: string;
  delivered: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    editWord,
    {},
  );
  const [editing, setEditing] = useState(false);

  // 保存に成功すると text が変わり、親が key で作り直すのでこの状態は畳まれる
  if (editing) {
    return (
      <form action={action} className="mt-5">
        <input type="hidden" name="wordId" value={wordId} />

        <textarea
          name="text"
          rows={4}
          defaultValue={text}
          minLength={MIN_WORD_LENGTH}
          maxLength={MAX_WORD_LENGTH}
          required
          autoFocus
          className="w-full resize-none border-b border-line bg-transparent py-3 leading-loose tracking-wide outline-none focus:border-accent"
        />

        {state.error && (
          <p className="mt-3 text-xs text-accent">{state.error}</p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 border border-line py-3 text-xs tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {pending ? "直しています…" : "直す"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="border border-line px-6 text-xs tracking-widest text-faint transition-colors hover:border-accent hover:text-accent"
          >
            やめる
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <p className="mt-5 leading-loose tracking-wide">{text}</p>

      {delivered ? (
        <p className="mt-3 text-xs text-faint">
          もう誰かに届いているので、直せません
        </p>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="mt-3 text-xs tracking-widest text-faint transition-colors hover:text-accent"
        >
          直す
        </button>
      )}
    </>
  );
}
