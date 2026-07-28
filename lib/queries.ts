import "server-only";

import { CLASSIC_RATIO, TIMEZONE } from "./config";
import { sql } from "./db";

export type Word = {
  id: string;
  text: string;
  author: string;
  source_type: "classic" | "user";
  source: string | null;
  source_url: string | null;
  original: string | null;
  translation_note: string | null;
  author_user_id: string | null;
  parent_word_id: string | null;
  created_at: Date;
};

/** 言葉と、その言葉が生まれるまでの系譜(古い順。末尾がその言葉自身)。 */
export type WordWithLineage = Word & { lineage: Word[] };

/* ------------------------------------------------------------------ *
 * ① 言葉が届く
 * ------------------------------------------------------------------ */

/** 今日すでに届いている言葉。まだなら null。 */
export async function getTodaysDelivery(userId: string): Promise<Word | null> {
  const rows = await sql<Word[]>`
    select w.*
      from deliveries d
      join words w on w.id = d.word_id
     where d.user_id = ${userId}::uuid
       and (d.delivered_at at time zone ${TIMEZONE})::date
         = (now()          at time zone ${TIMEZONE})::date
     order by d.delivered_at desc
     limit 1
  `;
  return rows[0] ?? null;
}

/** その人にとって最後に届いた言葉(日付を問わない)。「書く」対象の特定に使う。 */
export async function getLatestDelivery(userId: string): Promise<Word | null> {
  const rows = await sql<Word[]>`
    select w.*
      from deliveries d
      join words w on w.id = d.word_id
     where d.user_id = ${userId}::uuid
     order by d.delivered_at desc
     limit 1
  `;
  return rows[0] ?? null;
}

/**
 * まだ届いていない言葉を1つ引いて、配信履歴に記録する。
 *
 * 抽選は 偉人 : ユーザー = CLASSIC_RATIO : 1-CLASSIC_RATIO の比率で行う。
 * 選んだ側のプールが尽きていればもう一方から引く。
 * 自分が書いた言葉は自分には返さない。
 */
export async function drawWord(userId: string): Promise<Word | null> {
  const preferred = Math.random() < CLASSIC_RATIO ? "classic" : "user";
  const fallback = preferred === "classic" ? "user" : "classic";

  const word =
    (await pickUndelivered(userId, preferred)) ??
    (await pickUndelivered(userId, fallback));

  if (!word) return null;

  // 二重送信で同じ言葉が二度記録されるのを防ぐ
  await sql`
    insert into deliveries (user_id, word_id)
    values (${userId}::uuid, ${word.id}::uuid)
    on conflict (user_id, word_id) do nothing
  `;

  return word;
}

async function pickUndelivered(
  userId: string,
  sourceType: "classic" | "user",
): Promise<Word | null> {
  const rows = await sql<Word[]>`
    select w.*
      from words w
     where w.source_type = ${sourceType}
       and (w.author_user_id is null or w.author_user_id <> ${userId}::uuid)
       and not exists (
             select 1
               from deliveries d
              where d.user_id = ${userId}::uuid
                and d.word_id = w.id
           )
     order by random()
     limit 1
  `;
  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ *
 * ①' 来歴
 * ------------------------------------------------------------------ */

/**
 * 言葉に、それが生まれるまでの系譜を添えて返す。
 *
 * parent_word_id を根までたどる。ニーチェ → Aさん → Bさん → この言葉、という連鎖が
 * 1回の再帰クエリで取れる。これが「思想が受け渡されてきたこと」を可視化する中核。
 */
export async function getWordWithLineage(
  wordId: string,
): Promise<WordWithLineage | null> {
  const lineage = await sql<Word[]>`
    with recursive chain as (
        select w.*, 0 as depth
          from words w
         where w.id = ${wordId}::uuid
      union all
        select parent.*, chain.depth + 1
          from words parent
          join chain on parent.id = chain.parent_word_id
    )
    select id, text, author, source_type, source, source_url,
           original, translation_note, author_user_id, parent_word_id, created_at
      from chain
     order by depth desc
  `;

  if (lineage.length === 0) return null;

  // 根(いちばん古い言葉)から順に並んでいる。末尾がこの言葉自身。
  const self = lineage[lineage.length - 1];
  return { ...self, lineage };
}

/* ------------------------------------------------------------------ *
 * ② 書く
 * ------------------------------------------------------------------ */

/** その言葉に対して、すでに自分の言葉を書いているか。 */
export async function hasWrittenFor(
  userId: string,
  wordId: string,
): Promise<boolean> {
  const rows = await sql<{ exists: boolean }[]>`
    select exists (
      select 1 from words
       where author_user_id = ${userId}::uuid
         and parent_word_id = ${wordId}::uuid
    ) as exists
  `;
  return rows[0]?.exists ?? false;
}

/* ------------------------------------------------------------------ *
 * ③ 誰かに届いたことを見せる
 * ------------------------------------------------------------------ */

export type ReachStats = { today: number; total: number };

/** 自分が書いた言葉が、何人に届いたか。このプロダクトの報酬にあたる数字。 */
export async function getReachStats(userId: string): Promise<ReachStats> {
  const rows = await sql<{ today: number; total: number }[]>`
    select
      count(distinct d.user_id) filter (
        where (d.delivered_at at time zone ${TIMEZONE})::date
            = (now()          at time zone ${TIMEZONE})::date
      )::int as today,
      count(distinct d.user_id)::int as total
      from words w
      join deliveries d on d.word_id = w.id
     where w.author_user_id = ${userId}::uuid
  `;
  return rows[0] ?? { today: 0, total: 0 };
}

/* ------------------------------------------------------------------ *
 * ④⑤ 本
 * ------------------------------------------------------------------ */

/** 人生本の1ページ:きっかけになった言葉と、それに対して自分が書いた言葉。 */
export type BookPage = {
  written: Word;
  origin: Word | null;
};

/**
 * ある人の本。
 *
 * ページは独立したテーブルを持たない。「自分が書いた言葉」と
 * 「その言葉を生んだ言葉(parent_word_id)」の組がそのまま1ページになる。
 */
export async function getBook(userId: string): Promise<BookPage[]> {
  const rows = await sql<(Word & { origin: Word | null })[]>`
    select w.*,
           case when p.id is null then null else to_jsonb(p.*) end as origin
      from words w
      left join words p on p.id = w.parent_word_id
     where w.author_user_id = ${userId}::uuid
     order by w.created_at desc
  `;

  return rows.map(({ origin, ...written }) => ({ written, origin }));
}

export type BookSummary = {
  user_id: string;
  nickname: string;
  page_count: number;
  latest_text: string;
};

/** 他の人の本の一覧。1ページ以上書いている人だけが並ぶ。 */
export async function listBooks(excludeUserId?: string): Promise<BookSummary[]> {
  return sql<BookSummary[]>`
    select u.id            as user_id,
           u.nickname      as nickname,
           count(w.id)::int as page_count,
           (select w2.text
              from words w2
             where w2.author_user_id = u.id
             order by w2.created_at desc
             limit 1)      as latest_text
      from users u
      join words w on w.author_user_id = u.id
     where ${excludeUserId ? sql`u.id <> ${excludeUserId}::uuid` : sql`true`}
     group by u.id, u.nickname
     order by max(w.created_at) desc
  `;
}

export async function getUser(
  userId: string,
): Promise<{ id: string; nickname: string } | null> {
  const rows = await sql<{ id: string; nickname: string }[]>`
    select id, nickname from users where id = ${userId}::uuid
  `.catch(() => []);
  return rows[0] ?? null;
}
