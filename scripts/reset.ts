/**
 * すべてのテーブルを削除して作り直す。
 *
 *   npm run db:reset
 *
 * 実行後は npm run db:seed から入れ直すこと。
 */
import { loadEnv } from "./env";

loadEnv();

async function main() {
  const { sql } = await import("../lib/db");

  await sql`drop table if exists deliveries cascade`;
  await sql`drop table if exists words cascade`;
  await sql`drop table if exists users cascade`;

  console.log("テーブルを削除しました。npm run db:seed で入れ直してください。");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
