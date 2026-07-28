"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ALLOW_REROLL,
  DEEP_LINEAGE_COOKIE,
  SESSION_COOKIE,
} from "@/lib/config";
import {
  MAX_NICKNAME_LENGTH,
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
} from "@/lib/constants";
import { sql } from "@/lib/db";
import {
  drawDeepestLineage,
  drawWord,
  getTodaysDelivery,
  getWordWithLineage,
  type WordWithLineage,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export type ActionState = { error?: string; ok?: boolean };
export type ReceiveState = { error?: string; word?: WordWithLineage };

const YEAR = 60 * 60 * 24 * 365;

/** 初回訪問。ニックネームだけ受け取ってユーザーを作り、cookie に id を保持する。 */
export async function startSession(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!nickname || nickname.length > MAX_NICKNAME_LENGTH) {
    return {
      error: `ニックネームは1〜${MAX_NICKNAME_LENGTH}文字で入力してください。`,
    };
  }

  const [user] = await sql<{ id: string }[]>`
    insert into users (nickname) values (${nickname}) returning id
  `;

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: YEAR,
    path: "/",
  });

  redirect("/");
}

/** ① 今日のことづてを受け取る。 */
export async function receiveTodaysWord(): Promise<ReceiveState> {
  const user = await getCurrentUser();
  if (!user) return { error: "セッションが見つかりません。" };

  // 1日1回。ALLOW_REROLL のときだけ何度でも引ける(開発・デモ用)。
  if (!ALLOW_REROLL) {
    const existing = await getTodaysDelivery(user.id);
    if (existing) {
      const word = await getWordWithLineage(existing.id);
      return word ? { word } : { error: "言葉を読み込めませんでした。" };
    }
  }

  // デモで /demo から予約されていれば、系譜のいちばん深い言葉を引く。
  // 受け取りの演出はそのまま通したいので、抽選の中身だけを差し替える。
  const store = await cookies();
  const reserved = ALLOW_REROLL && store.get(DEEP_LINEAGE_COOKIE)?.value === "1";
  if (reserved) store.delete(DEEP_LINEAGE_COOKIE);

  const drawn = reserved
    ? ((await drawDeepestLineage(user.id)) ?? (await drawWord(user.id)))
    : await drawWord(user.id);

  if (!drawn) {
    // プールは在庫ではないので、これは「この人がまだ見ていない言葉が尽きた」という意味。
    // 誰かが書けばまた増える。
    return {
      error: "あなたに届いていない言葉が、いまはありません。誰かが新しい言葉を書くと、また届きます。",
    };
  }

  const word = await getWordWithLineage(drawn.id);
  if (!word) return { error: "言葉を読み込めませんでした。" };

  revalidatePath("/");
  return { word };
}

/** ② 心が動いたことを書く。書かれた言葉はそのまま抽選プールに入る。 */
export async function writeWord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "セッションが見つかりません。" };

  const text = String(formData.get("text") ?? "").trim();
  const parentWordId = String(formData.get("parentWordId") ?? "");

  // 書かれた言葉はそのまま抽選プールに入り、他の人に届く。
  // 一文字だけの投稿が誰かの「今日の一言」になってしまわないよう下限を設ける。
  if (text.length < MIN_WORD_LENGTH) {
    return {
      error: `もう少しだけ書いてみてください(${MIN_WORD_LENGTH}文字以上)。`,
    };
  }
  if (text.length > MAX_WORD_LENGTH) {
    return { error: `${MAX_WORD_LENGTH}文字以内で入力してください。` };
  }

  // 実際に自分に届いた言葉に対してしか書けない。
  // Server Action は UI を経由せず直接呼べるため、ここで必ず検証する。
  const [delivered] = await sql<{ id: string }[]>`
    select w.id
      from deliveries d
      join words w on w.id = d.word_id
     where d.user_id = ${user.id}::uuid
       and w.id      = ${parentWordId}::uuid
     limit 1
  `.catch(() => []);

  if (!delivered) {
    return { error: "その言葉はあなたに届いていません。" };
  }

  await sql`
    insert into words (text, author, source_type, author_user_id, parent_word_id)
    values (
      ${text},
      ${user.nickname},
      'user',
      ${user.id}::uuid,
      ${parentWordId}::uuid
    )
  `;

  revalidatePath("/");
  revalidatePath("/trace");
  revalidatePath("/others");
  return { ok: true };
}
