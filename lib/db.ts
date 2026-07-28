import postgres from "postgres";

declare global {
  // 開発中の hot reload で接続が増え続けるのを防ぐ
  var __kotozuteSql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL が設定されていません。.env.example を参照してください。",
    );
  }

  // Supabase など外部のマネージドDBは TLS 必須。ローカルの Postgres は非対応なので分ける。
  const isLocal = /@(localhost|127\.0\.0\.1)|host=\/|localhost/.test(url);

  return postgres(url, {
    ssl: isLocal ? false : "require",
    // Supabase の transaction pooler (6543番) は prepared statement を扱えない
    prepare: !url.includes(":6543"),
    max: 5,
    idle_timeout: 20,
  });
}

export const sql = globalThis.__kotozuteSql ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__kotozuteSql = sql;
}
