"use client";

import { useActionState } from "react";

import { MAX_NICKNAME_LENGTH } from "@/lib/constants";

import { startSession, type ActionState } from "../actions";

/**
 * 初回訪問。聞くのはニックネームだけ。
 *
 * メールもパスワードも扱わない。認証UIを作らないという判断もあるが、
 * それ以上に「気を使いすぎて言えない人」に向けたサービスで、
 * 入口に個人情報を要求するのは筋が通らない。
 * 送信すると cookie に匿名IDが入り、それが以後の身元になる。
 *
 * ここで先に「1日1回・書かなくてよい・明日誰かに届く」の3つを伝えている。
 * 特に2つめが無いと、書けなかった日に脱落する。
 */
export function Onboarding() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    startSession,
    {},
  );

  return (
    // 中身が少ないので上詰めだと下に大きな余白が残る。縦方向の中央に置く。
    <div className="animate-fade-up flex flex-1 flex-col justify-center">
      {/*
        書く欄のラベルと同じ言い方に揃える。
        「心が動いたら」は条件を言っているだけで、何をすればいいのか伝わらない。
      */}
      <p className="text-center text-sm leading-loose text-muted">
        1日に1つ、言葉が届きます。
        <br />
        読んで何かを思い出したら、書き残してください。
        <br />
        その言葉は明日、別の誰かに届きます。
      </p>

      {/*
        毎日書く義務にしないことを、最初に言い切っておく。
        「続けられなかった」で離れるのを防ぐのは、機能ではなく文面の仕事。
      */}
      <p className="mt-6 text-center text-xs leading-relaxed text-faint">
        書かない日があっても大丈夫です。
      </p>

      <form action={action} className="mt-12">
        <label
          htmlFor="nickname"
          className="block text-xs tracking-widest text-faint"
        >
          あなたの名前
        </label>

        <input
          id="nickname"
          name="nickname"
          maxLength={MAX_NICKNAME_LENGTH}
          required
          autoComplete="off"
          placeholder="たろう"
          // 入力欄自身が py-3 を持っているので、ラベルとの間はほとんど空けない
          className="mt-1 w-full border-b border-line bg-transparent py-3 text-lg outline-none placeholder:text-faint focus:border-accent"
        />

        {/* 何に使われる名前なのかを、入力する前に言う。 */}
        <p className="mt-3 text-xs leading-relaxed text-faint">
          あなたの言葉に添えられる名前です。メールアドレスもパスワードも使いません。
        </p>

        {state.error && (
          <p className="mt-4 text-xs text-accent">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full border border-line py-4 text-sm tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {pending ? "はじめています…" : "はじめる"}
        </button>
      </form>
    </div>
  );
}
