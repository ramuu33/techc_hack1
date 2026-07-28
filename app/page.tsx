import { ALLOW_REROLL } from "@/lib/config";
import {
  getReachStats,
  getTodaysDelivery,
  getWordWithLineage,
  hasWrittenFor,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

import { Onboarding } from "./components/onboarding";
import { Reach } from "./components/reach";
import { TodaysWord } from "./components/todays-word";

/**
 * ホーム。循環の入口と出口を、1画面に上下で並べている。
 *
 *   上 = 今日のことづて   … 受け取って、心が動いたら書く(循環の入口)
 *   下 = 届いた件数       … 自分の言葉が誰かに渡ったこと(循環の出口)
 *
 * この2つを同じ画面に置いているのが設計の要。抽選プールに入れるだけでは
 * 循環は企画書の中にしか存在せず、ユーザーは輪が閉じたことを体験できない。
 * 「渡った」が見えて初めて、受け取る側と書く側が地続きになる。
 *
 * 蓄積(軌跡)をホームに置いていないのも同じ理由。溜まることではなく
 * 渡ることを中心に据えている。
 */
export default async function Home() {
  const user = await getCurrentUser();
  // cookie が無い = 初回訪問。ニックネームだけ聞く画面に差し替える。
  if (!user) return <Onboarding />;

  // 今日ぶんが配信済みなら、その言葉を来歴つきで読み直す。
  // まだなら null のまま渡し、「受け取る」ボタンの状態で描画させる。
  const delivered = await getTodaysDelivery(user.id);
  const word = delivered ? await getWordWithLineage(delivered.id) : null;

  // 互いに依存しない2つの問い合わせなので、直列にせず同時に投げる。
  const [alreadyWritten, stats] = await Promise.all([
    word ? hasWrittenFor(user.id, word.id) : Promise.resolve(false),
    getReachStats(user.id),
  ]);

  return (
    <>
      <TodaysWord
        initialWord={word}
        allowReroll={ALLOW_REROLL}
        alreadyWritten={alreadyWritten}
      />
      <Reach stats={stats} />
    </>
  );
}
