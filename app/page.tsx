import { ALLOW_REROLL } from "@/lib/config";
import {
  getReachStats,
  getTodaysDelivery,
  getWordWithLineage,
  hasWrittenFor,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

import { Onboarding } from "./components/onboarding";
import { Reach } from "./components/reach";
import { TodaysWord } from "./components/todays-word";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) return <Onboarding />;

  const delivered = await getTodaysDelivery(user.id);
  const word = delivered ? await getWordWithLineage(delivered.id) : null;

  const [alreadyWritten, stats] = await Promise.all([
    word ? hasWrittenFor(user.id, word.id) : Promise.resolve(false),
    getReachStats(user.id),
  ]);

  return (
    <>
      <TodaysWord
        initialWord={word}
        allowReroll={ALLOW_REROLL}
        alreadyWritten={alreadyWritten}
      />
      <Reach stats={stats} />
    </>
  );
}
