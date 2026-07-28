"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  ALLOW_REROLL,
  DEEP_LINEAGE_COOKIE,
  SESSION_COOKIE,
} from "@/lib/config";
import { sql } from "@/lib/db";
import { peekDeepestLineage } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

/** デモ操作は ALLOW_REROLL=true のときしか動かない。本番デプロイでは常に閉じている。 */
function assertDemoMode() {
  if (!ALLOW_REROLL) {
    throw new Error("デモモードが無効です。");
  }
}

/** 別のユーザーとしてアプリを開く。受け取る側の視点を見せるために使う。 */
export async function becomeUser(formData: FormData) {
  assertDemoMode();

  const userId = String(formData.get("userId") ?? "");
  const [user] = await sql<{ id: string }[]>`
    select id from users where id = ${userId}::uuid
  `.catch(() => []);

  if (!user) return;

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  revalidatePath("/", "layout");
}

/** cookie を捨てて、初回訪問の状態に戻す。 */
export async function resetSession() {
  assertDemoMode();

  const store = await cookies();
  store.delete(SESSION_COOKIE);

  revalidatePath("/", "layout");
}

/**
 * 次にホームで受け取る言葉を、系譜がいちばん深いものにする。
 *
 * 通常の抽選は 偉人7 : ユーザー3 なので、来歴つきの言葉が一発で出るとは限らない。
 * ここで先に受け取ってしまうと「受け取る」ボタンから浮かび上がる演出が飛ぶため、
 * 予約だけしてホームに任せる。記録されるデータは通常の配信と同じ。
 */
export async function queueDeepestLineage(): Promise<{ message: string }> {
  assertDemoMode();

  const user = await getCurrentUser();
  if (!user) return { message: "先に名前を入れてはじめてください。" };

  const preview = await peekDeepestLineage(user.id);
  if (!preview) {
    return { message: "まだ受け取っていない、来歴つきの言葉がありません。" };
  }

  const store = await cookies();
  store.set(DEEP_LINEAGE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  revalidatePath("/");

  return {
    message: `予約しました(${preview})。ホームで「受け取る」を押すとこれが届きます。`,
  };
}

/**
 * 自分が最後に書いた言葉を、他の全員に届ける。
 *
 * 通常は相手がアプリを開いた時に抽選で届く。発表の場でそれを待てないため、
 * 同じ配信処理をその場で起こす。作られるデータは通常の配信とまったく同じ。
 */
export async function deliverLatestToEveryone(): Promise<{
  message: string;
}> {
  assertDemoMode();

  const user = await getCurrentUser();
  if (!user) return { message: "先にことづてを受け取ってください。" };

  const [latest] = await sql<{ id: string }[]>`
    select id from words
     where author_user_id = ${user.id}::uuid
     order by created_at desc
     limit 1
  `;

  if (!latest) {
    return { message: "まだ言葉を書いていません。" };
  }

  const delivered = await sql<{ user_id: string }[]>`
    insert into deliveries (user_id, word_id)
    select u.id, ${latest.id}::uuid
      from users u
     where u.id <> ${user.id}::uuid
    on conflict (user_id, word_id) do nothing
    returning user_id
  `;

  revalidatePath("/");
  revalidatePath("/demo");

  return {
    message: `あなたの最新の言葉を ${delivered.length} 人に届けました。ホームで件数を確認できます。`,
  };
}
