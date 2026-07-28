"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 画面は3つだけ。並び順がそのまま主従を表している。
 *
 *   今日のことづて … 循環そのもの(ホーム)
 *   わたしの軌跡   … 循環の結果として溜まるもの
 *   他の人の軌跡   … 他人の世界にふれる場所
 *
 * 増やさないことを設計として決めている。画面が増えるほど、
 * 「1日1回、受け取って書く」という主線が薄くなる。
 */
const LINKS = [
  { href: "/", label: "今日のことづて" },
  { href: "/trace", label: "わたしの軌跡" },
  { href: "/others", label: "他の人の軌跡" },
];

/**
 * 下端に常駐するナビゲーション。
 *
 * 自分がどこにいるかを常に見えるようにしておくためのもの。
 * スクロールしても消えないのは、書いている途中でも「自分の軌跡」への
 * 入口が視界にある状態を保ちたいため。
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 border-t border-line bg-background/90 backdrop-blur">
      <ul className="flex">
        {LINKS.map((link) => {
          // "/" だけは前方一致にすると全ページで現在地になってしまうので完全一致。
          // 他は /others/[userId] のような下層でも親を光らせたいので前方一致。
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`block py-4 text-center text-xs tracking-widest transition-colors ${
                  active ? "text-accent" : "text-faint hover:text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
