/**
 * デモ用のデータを投入する。
 *
 *   npm run db:demo
 *
 * 中身の定義は scripts/demo-data.ts にある。
 * 何度実行しても同じ結果になる。デモ用ユーザーは毎回作り直される。
 *
 * Node を使わずに Supabase の SQL エディタから投入したい場合は db/demo.sql を使う。
 */
import { DEMO_NICKNAMES, ENTRIES, EXTRA_DELIVERIES } from "./demo-data";
import { loadEnv } from "./env";

loadEnv();

async function main() {
  const { sql } = await import("../lib/db");

  // 作り直す。words と deliveries は cascade で消える。
  await sql`delete from users where nickname = any(${DEMO_NICKNAMES})`;

  const users = await sql<{ id: string; nickname: string }[]>`
    insert into users (nickname)
    select unnest(${DEMO_NICKNAMES}::text[])
    returning id, nickname
  `;
  const userId = Object.fromEntries(users.map((u) => [u.nickname, u.id]));

  /** その人が書いた言葉の id。EXTRA_DELIVERIES と後続の親参照から引く。 */
  const writtenBy: Record<string, string> = {};

  for (const entry of ENTRIES) {
    const parentId =
      entry.parent.kind === "classic"
        ? await classicWordId(sql, entry.parent.text)
        : writtenBy[entry.parent.nickname];

    if (!parentId) {
      throw new Error(`親になる言葉が見つかりません: ${JSON.stringify(entry.parent)}`);
    }

    // 届いていない言葉には書けない。実際の利用と同じ順序で入れる。
    await sql`
      insert into deliveries (user_id, word_id, delivered_at)
      values (
        ${userId[entry.nickname]}::uuid,
        ${parentId}::uuid,
        now() - ${`${entry.daysAgo} days`}::interval
      )
      on conflict (user_id, word_id) do nothing
    `;

    const [word] = await sql<{ id: string }[]>`
      insert into words (text, author, source_type, author_user_id, parent_word_id, created_at)
      values (
        ${entry.text},
        ${entry.nickname},
        'user',
        ${userId[entry.nickname]}::uuid,
        ${parentId}::uuid,
        now() - ${`${entry.daysAgo} days`}::interval
      )
      returning id
    `;

    writtenBy[entry.nickname] = word.id;
  }

  for (const extra of EXTRA_DELIVERIES) {
    for (const to of extra.to) {
      await sql`
        insert into deliveries (user_id, word_id, delivered_at)
        values (
          ${userId[to]}::uuid,
          ${writtenBy[extra.wordBy]}::uuid,
          now() - ${`${extra.daysAgo} days`}::interval
        )
        on conflict (user_id, word_id) do nothing
      `;
    }
  }

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

async function classicWordId(sql: Sql, text: string): Promise<string | undefined> {
  const [row] = await sql<{ id: string }[]>`
    select id from words where text = ${text} and source_type = 'classic'
  `;
  return row?.id;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
