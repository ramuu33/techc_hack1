import Link from "next/link";

import type { ReachStats } from "@/lib/queries";

/**
 * ③ 自分の言葉が誰かに届いたことを見せる。
 *
 * 抽選プールに入れるだけでは、循環はピッチの中にしか存在しない。
 * ここに数字が出て初めて、ユーザーは輪が閉じたことを体験できる。
 */
export function Reach({ stats }: { stats: ReachStats }) {
  if (stats.total === 0) return null;

  return (
    <section className="animate-fade-up mt-14 border-t border-line pt-8">
      <p className="text-center text-sm leading-loose">
        {stats.today > 0 ? (
          <>
            あなたの言葉が、今日
            <Count value={stats.today} />
            人に届きました
          </>
        ) : (
          <>
            あなたの言葉は、これまでに
            <Count value={stats.total} />
            人に届いています
          </>
        )}
      </p>

      {stats.today > 0 && stats.total > stats.today && (
        <p className="mt-2 text-center text-xs text-faint">
          これまでに {stats.total} 人
        </p>
      )}

      <p className="mt-6 text-center">
        <Link
          href="/book"
          className="text-xs tracking-widest text-faint transition-colors hover:text-muted"
        >
          わたしの本を開く
        </Link>
      </p>
    </section>
  );
}

function Count({ value }: { value: number }) {
  return <span className="mx-1.5 text-xl text-accent">{value}</span>;
}
