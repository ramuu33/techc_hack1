# 当日やること

上から順に。1〜3は他の作業の前提になるので、先に済ませる。

---

## 1. PR #9 をマージする

<https://github.com/ramuu33/techc_hack1/pull/9>

**これを先にやらないと、次の手順で使う `db/demo.sql` が古いままになる。**
マージ方法は「Create a merge commit」。

---

## 2. 本番DBにデモデータを入れる

Raw表示を開いて、**全文をコピー**する。

<https://github.com/ramuu33/techc_hack1/raw/main/db/demo.sql>

Supabase → SQL Editor に貼って実行。1回で終わる。

- 旧名(はるか・けんた・みお…)の削除と、新しい12人の投入が同時に済む
- 消えるのはデモ用の24個の名前だけ。実ユーザーには触れない
- トランザクションで囲んであるので、コピーが途中で切れた場合は何も入らずに巻き戻る

> **なぜ必要か。** スライド11枚目とデモGIFは「芥川龍之介 → のらねこ → 三日坊主 → こもれび」になっている。
> 本番が旧名のままだと、独自性の山場でスクリーンと実物の名前が食い違う。

---

## 3. 入ったか確認する

```sql
select nickname from users order by nickname;
```

**のらねこ・三日坊主・こもれび** が並び、自分と友達の名前も残っていればOK。

言葉と来歴まで見るなら:

```sql
select w.created_at, w.author, left(w.text, 30) as 本文,
       p.author as きっかけ
  from words w
  left join words p on p.id = w.parent_word_id
 where w.source_type = 'user'
 order by w.created_at desc
 limit 20;
```

---

## 4. テスト用の軌跡を消す(任意)

動作確認の跡が「他の人の軌跡」に並ぶのが気になる場合だけ。
**消す前に、その言葉から何か生まれていないか見る。**

```sql
select u.nickname,
       (select count(*) from words w where w.author_user_id = u.id) as 書いた数,
       (select count(*) from words c
          join words w on w.id = c.parent_word_id
         where w.author_user_id = u.id) as そこから生まれた数
  from users u
 order by u.nickname;
```

「そこから生まれた数」が0なら消して安全。0でなければ、消すと系譜が切れる。

```sql
delete from users where nickname = 'ここに名前';
```

---

## 5. QRコードを本番URLにする

`public/slides.html` の上のほうにある1行を書き換える。

```js
const QR_URL = "https://techc-hack1.vercel.app";
```

**この値は推測で入れてある。** 本番URLは Vercel のダッシュボードで確認する。

<https://vercel.com/hack5/techc-hack1>

書き換えたら、**自分のスマホでQRを一度読む。** 当日その場で読めないと気まずい。

---

## 6. 本番の環境変数を確認する

Vercel の Environment Variables で `ALLOW_REROLL` が `true` になっているか。

`false` だと `/demo` が404になり、**実演が成立しない。**

> 発表が終わったら `false` に戻す。SNSにURLを載せるのはそれから。
> `true` のままだと、誰でも `/demo` から他人として画面を開けてしまう。

---

## 7. 本番URLで通しで操作して、録画する

リハーサルとバックアップ動画を同時に片付ける。

1. `/demo` →「セッションを捨てる」
2. 名前を入れて「はじめる」→「受け取る」(4世代が出るはず)
3. その場で書いて「ことづてを託す」
4. `/demo` →「自分の最新の言葉を、他の全員に届ける」→ ホームで件数を確認
5. `/demo` → のらねことして開く → わたしの軌跡(「この言葉から、ことづてが生まれました」)
6. `/others` を開く

**この録画が、ネットワークが落ちたときの保険になる。** 別タブに開いておく。

---

## 8. 10分のリハーサルを1回

[`talk.md`](talk.md) を読み上げる。スライドは `F` で全画面、`T` でタイマー開始。

**全部読むと1分半ほど溢れる。**〔押していたら飛ばす〕の6か所を落とす練習を必ず1回やる。
落とす順は ①できていること ②他の人の軌跡 ③既存サービスの説明 ④デザインの話 ⑤工夫の2つめ ⑥再会。

「このサービスの価値」(7枚目)、「4世代」(11枚目)、「この言葉から、ことづてが生まれました」は、
**どれだけ押しても削らない。**

---

## 9. 発表の30分前

[`demo-script.md`](demo-script.md#発表の30分前にやること) のチェックリストを見る。

---

## 落ち着かないときに読む

事故対策は [`demo-script.md`](demo-script.md#事故対策) にある。想定質問は10問用意してある。

動くものはできている。あとは話すだけ。
