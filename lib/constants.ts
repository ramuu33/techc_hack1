/**
 * サーバーとブラウザの両方が参照する定数。
 *
 * lib/config.ts は process.env を読むため、クライアントコンポーネントからは import しない。
 * 両方で使う値はここに置く。
 */

/**
 * 書ける言葉の長さ。
 * 書かれた言葉はそのまま抽選プールに入って他の人に届くため、下限を設けている。
 */
export const MIN_WORD_LENGTH = 10;
export const MAX_WORD_LENGTH = 500;

/** ニックネームの長さ。DB 側の check 制約と揃えること。 */
export const MAX_NICKNAME_LENGTH = 20;
