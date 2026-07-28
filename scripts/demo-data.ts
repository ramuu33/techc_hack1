/**
 * デモで見せる状態の定義。
 *
 * 循環は、データが入っていないと画面上に何も出ない。機能が正しく動いていても
 * 「来歴」も「◯人に届きました」も空欄になる。ここはその状態を再現するための定義。
 *
 * scripts/demo.ts(DBに直接投入)と scripts/export-sql.ts(SQLファイルを書き出す)の
 * 両方がこれを読む。片方だけ直して食い違うことがないようにしている。
 */

export const DEMO_NICKNAMES = ["はるか", "けんた", "みお", "さとし"];

/** 偉人の言葉を親にする場合は text、ユーザーの言葉を親にする場合は nickname で指す。 */
export type Parent =
  | { kind: "classic"; text: string }
  | { kind: "user"; nickname: string };

export type Entry = {
  nickname: string;
  parent: Parent;
  text: string;
  daysAgo: number;
};

/**
 * 「言葉が届く → 心が動いて書く」の連なり。
 *
 * 先頭の3件が系譜になっている: 芥川龍之介 → はるか → けんた → みお。
 * 受け取っていない言葉には書けないため、投入も「届いた → 書いた」の順で行う。
 */
export const ENTRIES: Entry[] = [
  {
    nickname: "はるか",
    parent: {
      kind: "classic",
      text: "危険思想とは常識を実行に移そうとする思想である。",
    },
    text: "常識のほうが先にあって、自分の考えは後から来るものだと思っていた。逆かもしれない。おかしいと思ったことを口に出さずに飲み込んできたのは、常識を守るためというより、波風を立てたくなかっただけだった。",
    daysAgo: 9,
  },
  {
    nickname: "けんた",
    parent: { kind: "user", nickname: "はるか" },
    text: "波風を立てたくない、が自分にもある。会議で違和感を持っても「まあいいか」で終わらせる。でもそれを何回か続けたら、自分がその案に賛成したことになっていた。黙るのは中立じゃなかった。",
    daysAgo: 6,
  },
  {
    nickname: "みお",
    parent: { kind: "user", nickname: "けんた" },
    text: "黙るのは中立じゃない、という一文で、先月の自分を思い出した。友達が誰かの悪口を言っていたとき、否定も肯定もしなかった。あれは優しさのつもりだったけど、その場にいた誰にとってもそう見えていなかったと思う。",
    daysAgo: 3,
  },

  // 別の系統。他の人の本に厚みを出すために置いている。
  {
    nickname: "さとし",
    parent: {
      kind: "classic",
      text: "世界がぜんたい幸福にならないうちは個人の幸福はあり得ない",
    },
    text: "自分ひとりが幸せになる方法ばかり考えていた。就活の軸も、給料と休みの日数で決めていた。それが間違いだとは思わないけれど、その軸しか持っていないことには気づいていなかった。",
    daysAgo: 5,
  },
  {
    nickname: "さとし",
    parent: {
      kind: "classic",
      text: "不確実なものが確実なものの基礎である。",
    },
    text: "確実なことだけを積み上げて進もうとしていた。だから何も決められなかった。決めてから確かめる、という順番があることを、考えたことがなかった。",
    daysAgo: 1,
  },
];

/**
 * 書いた言葉が、さらに他の人にも届いたことにする。
 * 「あなたの言葉が◯人に届きました」が0にならないようにするため。
 */
export type ExtraDelivery = {
  /** 誰が書いた言葉か(その人は1件だけ書いている前提) */
  wordBy: string;
  to: string[];
  daysAgo: number;
};

export const EXTRA_DELIVERIES: ExtraDelivery[] = [
  { wordBy: "はるか", to: ["みお", "さとし"], daysAgo: 5 },
  { wordBy: "けんた", to: ["みお", "さとし"], daysAgo: 2 },
  { wordBy: "みお", to: ["はるか", "けんた", "さとし"], daysAgo: 0 },
];
