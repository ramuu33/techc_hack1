import type { BookPage } from "@/lib/queries";

import { displayAuthor } from "./word-card";

/**
 * ④ 人生本。
 *
 * 1ページ = きっかけになった言葉 + それに対して自分が書いた言葉。
 * 蓄積は循環の結果であって目的ではないため、ホームではなく2番目の画面に置いている。
 */
export function BookPages({ pages }: { pages: BookPage[] }) {
  return (
    <ol className="space-y-12">
      {pages.map((page, index) => (
        <li key={page.written.id} className="animate-fade-up">
          <div className="flex items-baseline justify-between">
            <span className="text-xs tracking-widest text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <time
              dateTime={page.written.created_at.toISOString()}
              className="text-xs text-faint"
            >
              {formatDate(page.written.created_at)}
            </time>
          </div>

          {page.origin && (
            <blockquote className="mt-4 border-l border-line pl-4">
              <p className="text-sm leading-loose text-muted">
                {page.origin.text}
              </p>
              <p className="mt-2 text-xs text-faint">
                — {displayAuthor(page.origin)}
              </p>
            </blockquote>
          )}

          <p className="mt-5 leading-loose tracking-wide">{page.written.text}</p>
        </li>
      ))}
    </ol>
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
