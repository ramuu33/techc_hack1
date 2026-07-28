import { config } from "dotenv";

/** Next.js の外(スクリプト)から実行するときに .env.local → .env の順で読む。 */
export function loadEnv() {
  config({ path: ".env.local", quiet: true });
  config({ path: ".env", quiet: true });

  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL が設定されていません。.env.example をコピーして .env.local を作成してください。",
    );
    process.exit(1);
  }
}
