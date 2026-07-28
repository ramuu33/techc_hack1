/** 抽選プールに占める偉人の言葉の比率。残りがユーザーの言葉。企画上の初期値は 偉人7 : ユーザー3。 */
export const CLASSIC_RATIO = clampRatio(process.env.CLASSIC_RATIO, 0.7);

/**
 * 1日1回の制限を外すかどうか。
 * 本番では false(1日1回の重みを守る)。開発中とデモ中だけ true にして、
 * 何度でも受け取り直せるようにする。
 */
export const ALLOW_REROLL = process.env.ALLOW_REROLL === "true";

/** 「1日」の区切りをどのタイムゾーンで判定するか。 */
export const TIMEZONE = process.env.TIMEZONE || "Asia/Tokyo";

export const SESSION_COOKIE = "kotozute_uid";

function clampRatio(raw: string | undefined, fallback: number) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) return fallback;
  return parsed;
}
