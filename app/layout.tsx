import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";

import "./globals.css";
import { Nav } from "./components/nav";

export const metadata: Metadata = {
  title: "ことづて",
  description:
    "偉人の言葉を種火に、心が動いた人が自分の言葉を書く。その言葉は明日、別の誰かに届く。",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="ja" className="h-full">
      <body className="flex min-h-full flex-col">
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5">
          {/*
            自分が誰であるかを常に画面に置く。
            名前を出すこと自体より、自分の軌跡への入口が常にあることが効く。
          */}
          <header className="flex items-baseline justify-between pt-10 pb-6">
            <Link
              href="/"
              className="text-lg tracking-[0.5em] text-muted transition-colors hover:text-accent"
            >
              ことづて
            </Link>

            {user && (
              <Link
                href="/trace"
                className="text-xs tracking-widest text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {user.nickname}
              </Link>
            )}
          </header>

          {/*
            flex にしてあるのは、中身の少ない画面が縦位置を自分で決められるようにするため。
            ナビは sticky なので最下部まで送れば自然位置に収まる。下に大きく空けると、
            中央に置いた中身がそのぶん上へずれてしまうので、余白は控えめにする。
          */}
          <main className="flex flex-1 flex-col pb-10">{children}</main>

          <Nav />
        </div>
      </body>
    </html>
  );
}
