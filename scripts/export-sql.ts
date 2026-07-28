/**
 * db/seed.sql と db/demo.sql を生成する。
 *
 *   npm run db:export
 *
 * Node を用意せずに Supabase の SQL エディタへ貼るだけで環境構築を終えられるようにするため、
 * data/words.seed.json と scripts/demo-data.ts から素の SQL を書き出す。
 * 生成物は決定的で、同じ入力からは毎回まったく同じファイルになる(差分がノイズにならない)。
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEMO_NICKNAMES, ENTRIES, EXTRA_DELIVERIES } from "./demo-data";

type SeedWord = {
  text: string;
  author: string;
  source?: string;
  source_url?: string;
  original?: string;
  translation_note?: string;
};

/** SQL のリテラルにする。単引用符を二重にするだけで足りる。 */
function lit(value: string | undefined | null) {
  if (value === undefined || value === null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * 名前から決まる UUID を作る(RFC 4122 版数5相当)。
 * 変数を使わずに済むよう、デモ用のユーザーと言葉には固定の id を与える。
 */
function uuidFor(name: string) {
  const bytes = createHash("sha1")
    .update(`kotozute-demo:${name}`)
    .digest()
    .subarray(0, 16);
  const b = Buffer.from(bytes);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = b.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

const HEADER = (what: string) =>
  `-- ${what}
--
-- このファイルは自動生成される。直接編集しないこと。
--   生成元: ${
    what.includes("偉人")
      ? "data/words.seed.json"
      : "scripts/demo-data.ts"
  }
--   生成:   npm run db:export
--
-- Supabase の SQL Editor にそのまま貼って実行できる。
-- 先に db/schema.sql を実行しておくこと。
--
-- ⚠️ コピーは GitHub の Raw 表示から行うこと。
--    通常のファイル表示は長いファイルを仮想スクロールするため、
--    全選択しても末尾まで取れず、途中で切れた SQL を貼ることになる。
--    (切れると文字列リテラルが途中で終わり、英文の一部がテーブル名として解釈される)
`;

function buildSeedSql() {
  const words: SeedWord[] = JSON.parse(
    readFileSync(join(process.cwd(), "data/words.seed.json"), "utf8"),
  );

  // 1文にまとめる。1件ごとに文を分けて重複チェックを書くと本文が二度出てきて、
  // ファイルが倍近くなる。長いほど貼り付けが途中で切れやすくなるので短く保つ。
  // 重複は schema.sql の words_classic_text_idx が弾く。
  const rows = words.map(
    (w) =>
      `  (${[
        lit(w.text),
        lit(w.author),
        "'classic'",
        lit(w.source),
        lit(w.source_url),
        lit(w.original),
        lit(w.translation_note),
      ].join(", ")})`,
  );

  const statements = [
    `insert into words (text, author, source_type, source, source_url, original, translation_note)
values
${rows.join(",\n")}
on conflict do nothing;`,
  ];

  // トランザクションで囲む。貼り付けが途中で切れたときに、
  // 半分だけ入った状態にならず、まるごと失敗して巻き戻る。
  return `${HEADER(`偉人の言葉 ${words.length} 件(すべてパブリックドメイン)`)}
begin;

${statements.join("\n\n")}

commit;
`;
}

function buildDemoSql() {
  const lines: string[] = [];

  lines.push("-- デモ用ユーザーを作り直す(words と deliveries は cascade で消える)");
  lines.push(
    `delete from users where nickname in (${DEMO_NICKNAMES.map(lit).join(", ")});`,
  );
  lines.push("");

  lines.push("insert into users (id, nickname) values");
  lines.push(
    DEMO_NICKNAMES.map(
      (n) => `  ('${uuidFor(`user:${n}`)}', ${lit(n)})`,
    ).join(",\n") + ";",
  );
  lines.push("");

  /**
   * その人が書いた言葉の id。
   * 参照される人は1件しか書かないことを assertReferencesResolve で保証している。
   */
  const wordIdOf = (nickname: string) =>
    uuidFor(`word:${nickname}:${ENTRIES.findIndex((e) => e.nickname === nickname)}`);

  for (const [i, entry] of ENTRIES.entries()) {
    const user = `'${uuidFor(`user:${entry.nickname}`)}'::uuid`;
    const interval = `now() - interval '${entry.daysAgo} days'`;
    const wordId = `'${uuidFor(`word:${entry.nickname}:${i}`)}'::uuid`;

    lines.push(
      `-- ${i + 1}. ${entry.nickname} が${
        entry.parent.kind === "classic"
          ? "偉人の言葉"
          : `${entry.parent.nickname}さんの言葉`
      }を受け取って書く`,
    );

    if (entry.parent.kind === "classic") {
      // 偉人の言葉は seed.sql 側で id が決まるため、本文で引く
      const parent = `(select id from words where text = ${lit(entry.parent.text)} and source_type = 'classic')`;

      lines.push(`insert into deliveries (user_id, word_id, delivered_at)
values (${user}, ${parent}, ${interval})
on conflict do nothing;`);

      lines.push(`insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values (${wordId}, ${lit(entry.text)}, ${lit(entry.nickname)}, 'user', ${user}, ${parent}, ${interval});`);
    } else {
      const parent = `'${wordIdOf(entry.parent.nickname)}'::uuid`;

      lines.push(`insert into deliveries (user_id, word_id, delivered_at)
values (${user}, ${parent}, ${interval})
on conflict do nothing;`);

      lines.push(`insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values (${wordId}, ${lit(entry.text)}, ${lit(entry.nickname)}, 'user', ${user}, ${parent}, ${interval});`);
    }

    lines.push("");
  }

  lines.push(
    "-- 書いた言葉が、さらに他の人にも届いたことにする(「◯人に届きました」を0にしないため)",
  );
  for (const extra of EXTRA_DELIVERIES) {
    for (const to of extra.to) {
      lines.push(`insert into deliveries (user_id, word_id, delivered_at)
values ('${uuidFor(`user:${to}`)}'::uuid, '${wordIdOf(extra.wordBy)}'::uuid, now() - interval '${extra.daysAgo} days')
on conflict do nothing;`);
    }
  }

  // seed.sql と同じ理由でトランザクションに入れる
  return `${HEADER("デモ用データ(4世代の系譜 + 配信履歴)")}
begin;

${lines.join("\n")}

commit;
`;
}

// ENTRIES では 1人が複数書くことがあるが、EXTRA_DELIVERIES と系譜の参照は
// 「その人が書いた1件」を指す。両者がずれていないことを確認する。
function assertReferencesResolve() {
  const referenced = new Set<string>([
    ...ENTRIES.flatMap((e) => (e.parent.kind === "user" ? [e.parent.nickname] : [])),
    ...EXTRA_DELIVERIES.map((d) => d.wordBy),
  ]);

  for (const nickname of referenced) {
    const count = ENTRIES.filter((e) => e.nickname === nickname).length;
    if (count !== 1) {
      throw new Error(
        `${nickname} は ${count} 件書いているため、「その人が書いた言葉」を一意に指せません。` +
          `demo-data.ts で参照される人は1件だけにしてください。`,
      );
    }
  }
}

assertReferencesResolve();

writeFileSync(join(process.cwd(), "db/seed.sql"), buildSeedSql());
writeFileSync(join(process.cwd(), "db/demo.sql"), buildDemoSql());

console.log("db/seed.sql と db/demo.sql を生成しました。");
