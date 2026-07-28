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
import {
  createUser,
  drawDeepestLineage,
  drawWord,
  getTodaysDelivery,
  getWordWithLineage,
  hasReceivedBefore,
  insertUserWord,
  isWordDelivered,
  updateUserWord,
  wasDeliveredTo,
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

  const userId = await createUser(nickname);

  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
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

  // 初めて受け取る1語も、来歴のある言葉を優先する。
  // 通常の抽選は偉人7:ユーザー3なので、7割の確率で来歴なしの言葉になり、
  // このプロダクトの新規性(来歴)が初対面で見えないままになる。
  // 第一印象だけは、おみくじに任せない。
  // ユーザーの言葉がまだ1つもなければ、自然に通常の抽選に落ちる。
  const first = !(await hasReceivedBefore(user.id));

  const drawn =
    reserved || first
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

  // 押し間違いだけを弾く。量は求めない。
  if (text.length < MIN_WORD_LENGTH) {
    return { error: "何も書かれていないようです。" };
  }
  if (text.length > MAX_WORD_LENGTH) {
    return { error: `${MAX_WORD_LENGTH}文字以内で入力してください。` };
  }

  // 実際に自分に届いた言葉に対してしか書けない。
  // Server Action は UI を経由せず直接呼べるため、ここで必ず検証する。
  if (!(await wasDeliveredTo(user.id, parentWordId))) {
    return { error: "その言葉はあなたに届いていません。" };
  }

  await insertUserWord({
    text,
    nickname: user.nickname,
    userId: user.id,
    parentWordId,
  });

  revalidatePath("/");
  revalidatePath("/trace");
  revalidatePath("/others");
  return { ok: true };
}

/**
 * 書いた言葉を直す。
 *
 * 直せるのは、**まだ誰にも届いていないうちだけ**。
 * 届いた後に書き換えると、それを読んで書いた人の言葉の親が変わってしまう。
 * 渡ったらもう自分のものではない、というのはこのプロダクトが言っていることでもある。
 */
export async function editWord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "セッションが見つかりません。" };

  const wordId = String(formData.get("wordId") ?? "");
  const text = String(formData.get("text") ?? "").trim();

  if (text.length < MIN_WORD_LENGTH) {
    return { error: "何も書かれていないようです。" };
  }
  if (text.length > MAX_WORD_LENGTH) {
    return { error: `${MAX_WORD_LENGTH}文字以内で入力してください。` };
  }

  const delivered = await isWordDelivered(user.id, wordId);

  if (delivered === null) return { error: "その言葉は直せません。" };
  if (delivered) {
    return { error: "この言葉はもう誰かに届いているので、直せません。" };
  }

  await updateUserWord(user.id, wordId, text);

  revalidatePath("/");
  revalidatePath("/trace");
  revalidatePath("/others");
  return { ok: true };
}
