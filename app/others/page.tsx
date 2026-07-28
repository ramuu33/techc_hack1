import Link from "next/link";

import { listTraces } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "他の人の軌跡 — ことづて" };

/**
 * 他の人の軌跡の一覧。閲覧だけで、反応する手段は置いていない。
 *
 * このプロダクトが賭けているのは「人が変わるのは立ち聞きのとき」という一点。
 * 自分に宛てられた言葉には防御が立ち、表明した意見は引っ込めにくくなる。
 * だからここには、いいねも、コメントも、フォローも作っていない。
 * 読んで、何か動いたら、自分の場所で自分の言葉を書く。それだけの導線にしている。
 *
 * 1点以上書いている人だけが並ぶ(空の軌跡は出さない)。
 */
export default async function OthersPage() {
  const user = await getCurrentUser();
  // 自分は一覧に出さない。自分の軌跡は /trace にある。
  const traces = await listTraces(user?.id);

  if (traces.length === 0) {
    return (
      <p className="pt-20 text-center text-sm leading-loose text-muted">
        まだ誰も書いていません。
        <br />
        最初の1点を置くのはあなたかもしれません。
      </p>
    );
  }

  return (
    <div>
      {/*
        なぜ他人のものを読むのか、を画面の側で一度だけ言っておく。
        説明が無いと「他人のメモ一覧」に見えてしまう。
      */}
      <p className="mb-10 text-center text-xs leading-loose text-faint">
        自分の当たり前は、自分では見えない。
        <br />
        違う考えに触れたときだけ、その差分に気づける。
      </p>

      <ul className="space-y-4">
        {traces.map((trace) => (
          <li key={trace.user_id} className="animate-fade-up">
            <Link
              href={`/others/${trace.user_id}`}
              className="block rounded-sm border border-line bg-surface px-6 py-6 transition-colors hover:border-accent"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm">{trace.nickname}の軌跡</span>
                <span className="text-xs text-faint">
                  {trace.point_count}つの点
                </span>
              </div>

              {/*
                最新の1件を2行だけ覗かせる。名前と点の数だけでは、
                その人が何を考えている人なのかが分からず、開く理由が生まれない。
              */}
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                {trace.latest_text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
