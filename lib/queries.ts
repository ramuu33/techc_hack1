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

/**
 * まだ届いていない言葉のうち、系譜がいちばん深いものを返す(配信は記録しない)。
 *
 * 通常の抽選では7割が偉人の言葉(系譜なし)になるため、
 * 「循環が見える瞬間」が一発で出るとは限らない。発表でそこを外さないための経路。
 */
export async function findDeepestUndelivered(
  userId: string,
): Promise<Word | null> {
  const rows = await sql<Word[]>`
    with recursive depths as (
        select w.id, w.parent_word_id, 0 as depth
          from words w
         where w.source_type = 'user'
      union all
        select d.id, parent.parent_word_id, d.depth + 1
          from depths d
          join words parent on parent.id = d.parent_word_id
    ),
    deepest as (
      select id, max(depth) as depth
        from depths
       group by id
    )
    select w.*
      from deepest
      join words w on w.id = deepest.id
     where (w.author_user_id is null or w.author_user_id <> ${userId}::uuid)
       and not exists (
             select 1
               from deliveries d
              where d.user_id = ${userId}::uuid
                and d.word_id = w.id
           )
     order by deepest.depth desc, w.created_at desc
     limit 1
  `;

  return rows[0] ?? null;
}

/** 系譜の深い言葉を実際に引いて、配信履歴に記録する。通常の配信と同じ1行が入る。 */
export async function drawDeepestLineage(userId: string): Promise<Word | null> {
  const word = await findDeepestUndelivered(userId);
  if (!word) return null;

  await sql`
    insert into deliveries (user_id, word_id)
    values (${userId}::uuid, ${word.id}::uuid)
    on conflict (user_id, word_id) do nothing
  `;

  return word;
}

/** 予約時に「何が届くか」を見せるための下読み。配信は記録しない。 */
export async function peekDeepestLineage(
  userId: string,
): Promise<string | null> {
  const word = await findDeepestUndelivered(userId);
  if (!word) return null;

  const withLineage = await getWordWithLineage(word.id);
  return (
    withLineage?.lineage.map((link) => link.author).join(" → ") ?? word.author
  );
}

/* ------------------------------------------------------------------ *
 * ①' 来歴
 * ------------------------------------------------------------------ */

/**
 * 言葉に、それが生まれるまでの系譜を添えて返す。
 *
 * parent_word_id を根までたどる。ニーチェ → Aさん → Bさん → この言葉、という連鎖が
 * 1回の再帰クエリで取れる。
 *
 * たどれるのは内容の継承ではなく「この言葉がなければ、この言葉は生まれなかった」という関係。
 * 実際、連鎖の端と端では主題がまったく違う。これが影響の循環を可視化する中核。
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

export type ReachStats = {
  /** 自分が書いた言葉の数。軌跡を作る点の数。 */
  points: number;
  /** 今日それが届いた人数 */
  today: number;
  /** これまでに届いた人数 */
  total: number;
};

/**
 * 自分が書いた言葉が、何人に届いたか。このプロダクトの報酬にあたる数字。
 * 点の数も一緒に返す。まだ誰にも届いていなくても、自分の痕跡は画面に出したい。
 */
export async function getReachStats(userId: string): Promise<ReachStats> {
  const rows = await sql<ReachStats[]>`
    select
      (select count(*) from words where author_user_id = ${userId}::uuid)::int
        as points,
      count(distinct d.user_id) filter (
        where (d.delivered_at at time zone ${TIMEZONE})::date
            = (now()          at time zone ${TIMEZONE})::date
      )::int as today,
      count(distinct d.user_id)::int as total
      from words w
      join deliveries d on d.word_id = w.id
     where w.author_user_id = ${userId}::uuid
  `;
  return rows[0] ?? { points: 0, today: 0, total: 0 };
}

/* ------------------------------------------------------------------ *
 * ④⑤ 軌跡
 * ------------------------------------------------------------------ */

/**
 * 軌跡の1点:きっかけになった言葉と、それに対して自分が書いた言葉。
 *
 * 点は独立したテーブルを持たない。「自分が書いた言葉」と
 * 「その言葉を生んだ言葉(parent_word_id)」の組がそのまま1点になる。
 */
export type TracePoint = {
  written: Word;
  origin: Word | null;
};

/**
 * 他の人の軌跡。書かれた言葉だけが並ぶ。
 *
 * 古い順に返す。新しい順に並べるとフィードとして読めてしまい、
 * その人が変わっていく過程が見えなくなるため。
 */
export async function getPublicTrace(userId: string): Promise<TracePoint[]> {
  const rows = await sql<(Word & { origin: Word | null })[]>`
    select w.*,
           case when p.id is null then null else to_jsonb(p.*) end as origin
      from words w
      left join words p on p.id = w.parent_word_id
     where w.author_user_id = ${userId}::uuid
     order by w.created_at asc
  `;

  return rows.map(({ origin, ...written }) => ({ written, origin }));
}

/** 自分の軌跡の1要素。届いただけでまだ書いていないものは written が null。 */
export type TraceEntry = {
  received: Word;
  written: Word | null;
  delivered_at: Date;
};

/**
 * 自分の軌跡。**届いた言葉すべて**が古い順に並ぶ。
 *
 * まだ書いていないものも含めるのは、届いたその場で言葉にできるとは限らないから。
 * 言葉が届いた瞬間と、前提が動く瞬間は同じとは限らない。
 * ただし件数バッジや催促は出さない。埋まっていないことは失敗ではなく「まだ」である。
 */
export async function getTrace(userId: string): Promise<TraceEntry[]> {
  return sql<TraceEntry[]>`
    select d.delivered_at,
           to_jsonb(r.*) as received,
           case when w.id is null then null else to_jsonb(w.*) end as written
      from deliveries d
      join words r on r.id = d.word_id
      left join words w
        on w.parent_word_id = d.word_id
       and w.author_user_id = d.user_id
     where d.user_id = ${userId}::uuid
     order by d.delivered_at asc, w.created_at asc nulls first
  `;
}

export type TraceSummary = {
  user_id: string;
  nickname: string;
  point_count: number;
  latest_text: string;
};

/** 他の人の軌跡の一覧。1点以上書いている人だけが並ぶ。 */
export async function listTraces(
  excludeUserId?: string,
): Promise<TraceSummary[]> {
  return sql<TraceSummary[]>`
    select u.id            as user_id,
           u.nickname      as nickname,
           count(w.id)::int as point_count,
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
