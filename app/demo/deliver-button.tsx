"use client";

import { useState, useTransition } from "react";

import { deliverLatestToEveryone } from "./actions";

export function DeliverButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4">
      <button
        onClick={() =>
          startTransition(async () => {
            const result = await deliverLatestToEveryone();
            setMessage(result.message);
          })
        }
        disabled={pending}
        className="w-full border border-line py-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        {pending ? "届けています…" : "自分の最新の言葉を、他の全員に届ける"}
      </button>

      {message && <p className="mt-3 text-xs text-accent">{message}</p>}
    </div>
  );
}
