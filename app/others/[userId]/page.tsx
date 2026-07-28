import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicTrace, getUser } from "@/lib/queries";

import { PublicTrace } from "../../components/trace-points";

export default async function OtherTracePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const owner = await getUser(userId);
  if (!owner) notFound();

  const points = await getPublicTrace(owner.id);

  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-sm tracking-[0.3em] text-muted">
          {owner.nickname}の軌跡
        </h2>
        <p className="mt-3 text-xs text-faint">{points.length}つの点</p>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          古いものから並んでいます
        </p>
      </div>

      <PublicTrace points={points} />

      <p className="mt-14 text-center">
        <Link
          href="/others"
          className="text-xs tracking-widest text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          ← 他の人の軌跡へ戻る
        </Link>
      </p>
    </div>
  );
}
