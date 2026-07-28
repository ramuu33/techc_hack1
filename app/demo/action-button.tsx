"use client";

import { useState, useTransition } from "react";

/** デモ操作のボタン。結果の一言をその場に出す。 */
export function ActionButton({
  label,
  pendingLabel,
  action,
}: {
  label: string;
  pendingLabel: string;
  action: () => Promise<{ message: string }>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4">
      <button
        onClick={() =>
          startTransition(async () => {
            const result = await action();
            setMessage(result.message);
          })
        }
        disabled={pending}
        className="w-full border border-line py-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        {pending ? pendingLabel : label}
      </button>

      {message && (
        <p className="mt-3 text-xs leading-relaxed text-accent">{message}</p>
      )}
    </div>
  );
}
