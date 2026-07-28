/**
 * スクリプト用の環境変数読み込み。
 *
 * seed / demo / reset / export は Next.js のプロセスの外で動くため、
 * .env.local が自動では読まれない。ここで明示的に読む。
 * アプリ本体はこれを使わない(Next.js が自前で読む)。
 */

import { config } from "dotenv";

/** Next.js の外(スクリプト)から実行するときに .env.local → .env の順で読む。 */
export function loadEnv() {
  config({ path: ".env.local", quiet: true });
  config({ path: ".env", quiet: true });

  // 接続先が無いまま進むと、意味の分かりにくいドライバのエラーで落ちる。
  // ここで止めて、何をすればいいかまで書く。
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL が設定されていません。.env.example をコピーして .env.local を作成してください。",
    );
    process.exit(1);
  }
}
