/**
 * スキーマを適用し、偉人の言葉(data/words.seed.json)を投入する。
 *
 *   npm run db:seed
 *
 * 何度実行しても同じ結果になる。すでに入っている言葉は重複して入らない。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { loadEnv } from "./env";

loadEnv();

type SeedWord = {
  text: string;
  author: string;
  source?: string;
  source_url?: string;
  source_type: "classic";
  original?: string;
  translation_note?: string;
};

async function main() {
  const { sql } = await import("../lib/db");

  const schema = readFileSync(join(process.cwd(), "db/schema.sql"), "utf8");
  await sql.unsafe(schema);
  console.log("スキーマを適用しました。");

  const words: SeedWord[] = JSON.parse(
    readFileSync(join(process.cwd(), "data/words.seed.json"), "utf8"),
  );

  let inserted = 0;
  for (const word of words) {
    const rows = await sql`
      insert into words (text, author, source_type, source, source_url, original, translation_note)
      select ${word.text},
             ${word.author},
             'classic',
             ${word.source ?? null},
             ${word.source_url ?? null},
             ${word.original ?? null},
             ${word.translation_note ?? null}
      where not exists (
        select 1 from words
         where text = ${word.text} and source_type = 'classic'
      )
      returning id
    `;
    inserted += rows.length;
  }

  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count from words where source_type = 'classic'
  `;

  console.log(`偉人の言葉を ${inserted} 件追加しました(合計 ${count} 件)。`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
