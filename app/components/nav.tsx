"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "今日のことづて" },
  { href: "/book", label: "わたしの本" },
  { href: "/others", label: "他の人の本" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 border-t border-line bg-background/90 backdrop-blur">
      <ul className="flex">
        {LINKS.map((link) => {
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
