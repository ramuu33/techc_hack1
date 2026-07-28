import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./config";
import { sql } from "./db";

export type CurrentUser = { id: string; nickname: string };

/**
 * 現在のユーザーを返す。未登録なら null。
 *
 * 認証は行わない。初回訪問時にニックネームだけ受け取ってユーザーを作り、
 * その id を cookie に保持する。パスワードもメールアドレスも扱わない。
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const rows = await sql<CurrentUser[]>`
    select id, nickname from users where id = ${id}::uuid
  `.catch(() => []);

  return rows[0] ?? null;
}
