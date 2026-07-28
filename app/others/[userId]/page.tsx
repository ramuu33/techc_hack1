import Link from "next/link";
import { notFound } from "next/navigation";

import { getBook, getUser } from "@/lib/queries";

import { BookPages } from "../../components/book-pages";

export default async function OtherBookPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const owner = await getUser(userId);
  if (!owner) notFound();

  const pages = await getBook(owner.id);

  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="text-sm tracking-[0.3em] text-muted">
          {owner.nickname}の本
        </h2>
        <p className="mt-3 text-xs text-faint">{pages.length} ページ</p>
      </div>

      <BookPages pages={pages} />

      <p className="mt-14 text-center">
        <Link
          href="/others"
          className="text-xs tracking-widest text-faint transition-colors hover:text-muted"
        >
          他の人の本へ戻る
        </Link>
      </p>
    </div>
  );
}
