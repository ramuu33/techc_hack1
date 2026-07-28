/**
 * サーバーとブラウザの両方が参照する定数。
 *
 * lib/config.ts は process.env を読むため、クライアントコンポーネントからは import しない。
 * 両方で使う値はここに置く。
 */

/**
 * 書ける言葉の長さ。
 *
 * 下限は「押し間違いを弾く」ためだけのもので、内容の量を要求しない。
 * 「自分もそうだった」で言い尽くせることもあり、
 * 長く書けたかどうかは気づきの深さと関係がない。
 */
export const MIN_WORD_LENGTH = 2;
export const MAX_WORD_LENGTH = 500;

/** ニックネームの長さ。DB 側の check 制約と揃えること。 */
export const MAX_NICKNAME_LENGTH = 20;
