/**
 * 系譜を1行に収める。
 *
 * 循環が回るほど連鎖は深くなるので、全員を並べるといずれ読めなくなる。
 * 残すのは根(たいてい偉人で、「ここから始まった」という話)と、
 * 直前の親(実際にきっかけになった人)。間は人数だけで足りる。
 *
 *   芥川龍之介 → はるか → けんた → みお
 *   孔子 → …8人 → 連鎖9 → 連鎖10
 *
 * 畳むのは表示だけで、たどれる事実そのものはデータに残る。
 */
export function summarizeLineage(authors: string[]) {
  if (authors.length <= 4) return authors.join(" → ");

  const hidden = authors.length - 3;
  return [authors[0], `…${hidden}人`, ...authors.slice(-2)].join(" → ");
}
