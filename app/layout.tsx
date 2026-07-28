import type { Metadata } from "next";

import "./globals.css";
import { Nav } from "./components/nav";

export const metadata: Metadata = {
  title: "ことづて",
  description:
    "偉人の言葉を種火に、心が動いた人が自分の言葉を書く。その言葉は明日、別の誰かに届く。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body className="flex min-h-full flex-col">
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5">
          <header className="pt-10 pb-6 text-center">
            <h1 className="text-lg tracking-[0.5em] text-muted">ことづて</h1>
          </header>

          {/* 下端は sticky なナビが重なるぶんだけ空けておく */}
          <main className="flex-1 pb-24">{children}</main>

          <Nav />
        </div>
      </body>
    </html>
  );
}
