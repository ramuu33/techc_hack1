import { notFound } from "next/navigation";

import { ALLOW_REROLL } from "@/lib/config";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { ActionButton } from "./action-button";
import {
  becomeUser,
  deliverLatestToEveryone,
  queueDeepestLineage,
  resetSession,
} from "./actions";

export const metadata = { title: "デモ操作 — ことづて" };

/**
 * 発表用の操作盤。プロダクトの機能ではなく、発表のための道具。
 *
 * このプロダクトは「1日1回」「明日届く」という時間の設計が中核にあるので、
 * 10分の発表で循環を一周させることが本来できない。ここはその時間を
 * 早送りするためだけの画面で、通常の配信とまったく同じ処理を呼んでいる。
 * 見せかけのデータを作っているわけではない。
 *
 * ALLOW_REROLL=true のときだけ開く。本番は false なので 404 になる。
 */
export default async function DemoPage() {
  // 本番デプロイでは存在しない画面
  if (!ALLOW_REROLL) notFound();

  const current = await getCurrentUser();

  // ここだけ SQL を直に書いている。デモ画面でしか使わない問い合わせなので、
  // 本編のデータ層(lib/queries.ts)には混ぜない。
  const users = await sql<
    { id: string; nickname: string; page_count: number }[]
  >`
    select u.id,
           u.nickname,
           count(w.id) filter (where w.source_type = 'user')::int as page_count
      from users u
      left join words w on w.author_user_id = u.id
     group by u.id, u.nickname
     order by u.created_at
  `;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-sm tracking-[0.3em] text-muted">デモ操作</h2>
        <p className="mt-3 text-xs leading-relaxed text-faint">
          ALLOW_REROLL=true のときだけ開く画面です。本番では 404 になります。
          現在は
          <span className="mx-1 text-accent">
            {current ? current.nickname : "未登録"}
          </span>
          として開いています。
        </p>
      </div>

      <section>
        <h3 className="text-xs tracking-widest text-faint">
          別の人として開く
        </h3>
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li key={user.id}>
              <form action={becomeUser}>
                <input type="hidden" name="userId" value={user.id} />
                <button
                  type="submit"
                  disabled={user.id === current?.id}
                  className="flex w-full items-baseline justify-between border border-line px-5 py-4 text-left text-sm transition-colors hover:border-accent disabled:opacity-40"
                >
                  <span>{user.nickname}</span>
                  <span className="text-xs text-faint">
                    {user.page_count} ページ
                  </span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xs tracking-widest text-faint">
          来歴つきの言葉を確実に出す
        </h3>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          通常の抽選は 偉人7 : ユーザー3
          なので、来歴つきの言葉が一発で出るとは限りません。次の受け取りだけを
          系譜のいちばん深い言葉に差し替えます。ホームの「受け取る」から普段どおり開けます。
        </p>
        <ActionButton
          label="次に受け取る言葉を、系譜の深いものにする"
          pendingLabel="予約しています…"
          action={queueDeepestLineage}
        />
      </section>

      <section>
        <h3 className="text-xs tracking-widest text-faint">
          循環を、その場で1周させる
        </h3>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          通常は相手がアプリを開いた時に抽選で届きます。発表の場でそれを待てないため、
          同じ配信処理をその場で起こします。作られるデータは通常の配信と同じです。
        </p>
        <ActionButton
          label="自分の最新の言葉を、他の全員に届ける"
          pendingLabel="届けています…"
          action={deliverLatestToEveryone}
        />
      </section>

      <section>
        <h3 className="text-xs tracking-widest text-faint">初回訪問に戻す</h3>
        <form action={resetSession} className="mt-4">
          <button
            type="submit"
            className="w-full border border-line py-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            セッションを捨てる
          </button>
        </form>
      </section>
    </div>
  );
}
