/**
 * デモ用のデータを投入する。
 *
 *   npm run db:demo
 *
 * 循環は、データが入っていないと画面上に何も出ない。
 * 機能が正しく動いていても「来歴」も「◯人に届きました」も空欄になる。
 * このスクリプトは、発表で見せる状態を再現するために
 *   - 4世代の系譜(芥川龍之介 → はるか → けんた → みお)
 *   - 配信履歴(誰の言葉が何人に届いたか)
 * を作る。
 *
 * 何度実行しても同じ結果になる。デモ用ユーザーは毎回作り直される。
 */
import { loadEnv } from "./env";

loadEnv();

const DEMO_NICKNAMES = ["はるか", "けんた", "みお", "さとし"];

/** 系譜の起点にする偉人の言葉。data/words.seed.json に必ず含まれている。 */
const ROOT_TEXT = "危険思想とは常識を実行に移そうとする思想である。";

async function main() {
  const { sql } = await import("../lib/db");

  // 作り直す。words と deliveries は cascade で消える。
  await sql`delete from users where nickname = any(${DEMO_NICKNAMES})`;

  const users = await sql<{ id: string; nickname: string }[]>`
    insert into users (nickname)
    select unnest(${DEMO_NICKNAMES}::text[])
    returning id, nickname
  `;
  const by = Object.fromEntries(users.map((u) => [u.nickname, u.id]));

  const [root] = await sql<{ id: string }[]>`
    select id from words where text = ${ROOT_TEXT} and source_type = 'classic'
  `;
  if (!root) {
    throw new Error(
      "起点にする偉人の言葉が見つかりません。先に npm run db:seed を実行してください。",
    );
  }

  // ---- 4世代の系譜 -------------------------------------------------
  // 芥川龍之介 → はるか → けんた → みお
  // それぞれ「届いた → 書いた」の順に記録する。実際の利用と同じ経路を通す。

  const haruka = await passOn({
    sql,
    userId: by["はるか"],
    nickname: "はるか",
    parentWordId: root.id,
    text: "常識のほうが先にあって、自分の考えは後から来るものだと思っていた。逆かもしれない。おかしいと思ったことを口に出さずに飲み込んできたのは、常識を守るためというより、波風を立てたくなかっただけだった。",
    daysAgo: 9,
  });

  const kenta = await passOn({
    sql,
    userId: by["けんた"],
    nickname: "けんた",
    parentWordId: haruka,
    text: "波風を立てたくない、が自分にもある。会議で違和感を持っても「まあいいか」で終わらせる。でもそれを何回か続けたら、自分がその案に賛成したことになっていた。黙るのは中立じゃなかった。",
    daysAgo: 6,
  });

  const mio = await passOn({
    sql,
    userId: by["みお"],
    nickname: "みお",
    parentWordId: kenta,
    text: "黙るのは中立じゃない、という一文で、先月の自分を思い出した。友達が誰かの悪口を言っていたとき、否定も肯定もしなかった。あれは優しさのつもりだったけど、その場にいた誰にとってもそう見えていなかったと思う。",
    daysAgo: 3,
  });

  // ---- 別の系統(他の人の本に厚みを出す)----------------------------

  const [miyazawa] = await sql<{ id: string }[]>`
    select id from words
     where source_type = 'classic' and author = '宮沢賢治'
     order by random() limit 1
  `;

  await passOn({
    sql,
    userId: by["さとし"],
    nickname: "さとし",
    parentWordId: miyazawa.id,
    text: "自分ひとりが幸せになる方法ばかり考えていた。就活の軸も、給料と休みの日数で決めていた。それが間違いだとは思わないけれど、その軸しか持っていないことには気づいていなかった。",
    daysAgo: 5,
  });

  const [miki] = await sql<{ id: string }[]>`
    select id from words
     where source_type = 'classic' and author = '三木清'
     order by random() limit 1
  `;

  await passOn({
    sql,
    userId: by["さとし"],
    nickname: "さとし",
    parentWordId: miki.id,
    text: "考えることと、悩むことを同じだと思っていた。悩んでいる時間の長さで、自分は真剣だと思い込んでいた。実際には同じところを回っていただけだった。",
    daysAgo: 1,
  });

  // ---- 配信履歴 ----------------------------------------------------
  // 「あなたの言葉が◯人に届きました」が空にならないようにする。
  // 系譜で作った分に加えて、書いた言葉が他の人にも届いたことにする。

  await deliver(sql, haruka, [by["みお"], by["さとし"]], 5);
  await deliver(sql, kenta, [by["みお"], by["さとし"]], 2);
  await deliver(sql, mio, [by["はるか"], by["けんた"], by["さとし"]], 0);

  const [{ count: wordCount }] = await sql<{ count: number }[]>`
    select count(*)::int as count from words where source_type = 'user'
  `;
  const [{ count: deliveryCount }] = await sql<{ count: number }[]>`
    select count(*)::int as count from deliveries
  `;

  console.log(
    `デモデータを投入しました。ユーザー ${users.length} 人 / ユーザーの言葉 ${wordCount} 件 / 配信履歴 ${deliveryCount} 件`,
  );
  console.log("系譜: 芥川龍之介 → はるか → けんた → みお");

  await sql.end();
}

type Sql = Awaited<typeof import("../lib/db")>["sql"];

/**
 * 「言葉が届く → 心が動いて書く」の1往復を記録する。
 * 実際の利用と同じく、届いていない言葉には書けない順序で入れる。
 */
async function passOn({
  sql,
  userId,
  nickname,
  parentWordId,
  text,
  daysAgo,
}: {
  sql: Sql;
  userId: string;
  nickname: string;
  parentWordId: string;
  text: string;
  daysAgo: number;
}): Promise<string> {
  await sql`
    insert into deliveries (user_id, word_id, delivered_at)
    values (
      ${userId}::uuid,
      ${parentWordId}::uuid,
      now() - ${`${daysAgo} days`}::interval
    )
    on conflict (user_id, word_id) do nothing
  `;

  const [word] = await sql<{ id: string }[]>`
    insert into words (text, author, source_type, author_user_id, parent_word_id, created_at)
    values (
      ${text},
      ${nickname},
      'user',
      ${userId}::uuid,
      ${parentWordId}::uuid,
      now() - ${`${daysAgo} days`}::interval
    )
    returning id
  `;

  return word.id;
}

/** ある言葉が複数の人に届いたことにする。 */
async function deliver(
  sql: Sql,
  wordId: string,
  userIds: string[],
  daysAgo: number,
) {
  for (const userId of userIds) {
    await sql`
      insert into deliveries (user_id, word_id, delivered_at)
      values (
        ${userId}::uuid,
        ${wordId}::uuid,
        now() - ${`${daysAgo} days`}::interval
      )
      on conflict (user_id, word_id) do nothing
    `;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
