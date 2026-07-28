import Link from "next/link";

import { listBooks } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "他の人の本 — ことづて" };

export default async function OthersPage() {
  const user = await getCurrentUser();
  const books = await listBooks(user?.id);

  if (books.length === 0) {
    return (
      <p className="pt-20 text-center text-sm leading-loose text-muted">
        まだ誰も書いていません。
        <br />
        最初の1ページを書くのはあなたかもしれません。
      </p>
    );
  }

  return (
    <div>
      <p className="mb-10 text-center text-xs leading-loose text-faint">
        自分の当たり前は、自分では見えない。
        <br />
        違う考えに触れたときだけ、その差分に気づける。
      </p>

      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.user_id} className="animate-fade-up">
            <Link
              href={`/others/${book.user_id}`}
              className="block rounded-sm border border-line bg-surface px-6 py-6 transition-colors hover:border-accent"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm">{book.nickname}の本</span>
                <span className="text-xs text-faint">
                  {book.page_count} ページ
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                {book.latest_text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
