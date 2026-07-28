import Link from "next/link";

import { getBook, getReachStats } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

import { BookPages } from "../components/book-pages";

export const metadata = { title: "わたしの本 — ことづて" };

export default async function BookPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Empty>
        <Link href="/" className="underline underline-offset-4">
          最初のことづてを受け取る
        </Link>
      </Empty>
    );
  }

  const [pages, stats] = await Promise.all([
    getBook(user.id),
    getReachStats(user.id),
  ]);

  if (pages.length === 0) {
    return (
      <Empty>
        まだ1ページも書かれていません。
        <br />
        <Link href="/" className="underline underline-offset-4">
          今日のことづてを受け取る
        </Link>
      </Empty>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="text-sm tracking-[0.3em] text-muted">
          {user.nickname}の本
        </h2>
        <p className="mt-3 text-xs text-faint">
          {pages.length} ページ・のべ {stats.total} 人に届きました
        </p>
      </div>

      <BookPages pages={pages} />
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-20 text-center text-sm leading-loose text-muted">
      {children}
    </p>
  );
}
