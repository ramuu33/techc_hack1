import Link from "next/link";

import type { ReachStats } from "@/lib/queries";

/**
 * ③ 自分の言葉が誰かに届いたことを見せる。
 *
 * 抽選プールに入れるだけでは、循環はピッチの中にしか存在しない。
 * ここに数字が出て初めて、ユーザーは輪が閉じたことを体験できる。
 *
 * まだ誰にも届いていなくても、点の数だけは出す。ホームに自分の痕跡が
 * ひとつもないと、他人の言葉を見るだけの場所になってしまうため。
 */
export function Reach({ stats }: { stats: ReachStats }) {
  if (stats.points === 0) return null;

  return (
    <section className="animate-fade-up mt-14 border-t border-line pt-8">
      {stats.today > 0 ? (
        <p className="text-center text-sm leading-loose">
          あなたの言葉が、今日
          <Count value={stats.today} />
          人に届きました
        </p>
      ) : (
        stats.total > 0 && (
          <p className="text-center text-sm leading-loose">
            あなたの言葉は、これまでに
            <Count value={stats.total} />
            人に届いています
          </p>
        )
        // まだ誰にも届いていないときは何も言わない。
        // 「明日から届きはじめます」は、書いた直後に出る文言と同じことを繰り返すため。
      )}

      {stats.today > 0 && stats.total > stats.today && (
        <p className="mt-2 text-center text-xs text-faint">
          これまでに {stats.total} 人
        </p>
      )}

      <p className="mt-6 text-center">
        <Link
          href="/trace"
          className="text-xs tracking-widest text-faint transition-colors hover:text-accent"
        >
          わたしの軌跡 — {stats.points} の点
        </Link>
      </p>
    </section>
  );
}

function Count({ value }: { value: number }) {
  return <span className="mx-1.5 text-xl text-accent">{value}</span>;
}
