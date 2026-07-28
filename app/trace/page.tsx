import Link from "next/link";

import { getReachStats, getTrace } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

import { MyTrace } from "../components/trace-points";

export const metadata = { title: "わたしの軌跡 — ことづて" };

export default async function TracePage() {
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

  const [entries, stats] = await Promise.all([
    getTrace(user.id),
    getReachStats(user.id),
  ]);

  if (entries.length === 0) {
    return (
      <Empty>
        まだ何も届いていません。
        <br />
        <Link href="/" className="underline underline-offset-4">
          今日のことづてを受け取る
        </Link>
      </Empty>
    );
  }

  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-sm tracking-[0.3em] text-muted">
          {user.nickname}の軌跡
        </h2>
        <p className="mt-3 text-xs text-faint">
          {stats.points}つの点
          {stats.total > 0 && ` ・ のべ ${stats.total} 人が受け取りました`}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          点が増えるほど、軌跡が見えてくる
        </p>
      </div>

      <MyTrace entries={entries} />
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
