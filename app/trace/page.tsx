import Link from "next/link";

import { getReachStats, getTrace } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

import { MyTrace } from "../components/trace-points";

export const metadata = { title: "わたしの軌跡 — ことづて" };

/**
 * わたしの軌跡。届いた言葉と、それに対して自分が書いた言葉が並ぶ。
 *
 * 循環の結果として溜まるものなので、ホームではなく2番目の画面に置いている。
 * ここを入口にすると「記録を溜めるアプリ」になり、渡ることより溜まることが
 * 目的に見えてしまう。
 *
 * 表示は届いた順(古い順)。書いていない日も点として残す。埋まっていない
 * ことは失敗ではなく「まだ」なので、件数バッジも催促も出さない。
 */
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

  // 軌跡そのものと、到達件数。互いに独立なので同時に取る。
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
        {/*
          「◯人が受け取りました」は0のときは出さない。
          0と書くと、届いていないことを失敗として突きつけることになる。
        */}
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

/** 何も無いときの置き場。責めない文面にして、必ず次の一歩を添える。 */
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-20 text-center text-sm leading-loose text-muted">
      {children}
    </p>
  );
}
