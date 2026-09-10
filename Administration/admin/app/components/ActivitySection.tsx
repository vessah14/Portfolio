import { QuickOverview } from "./QuickOverview";
import { RecentMessages } from "./RecentMessages";

export function ActivitySection() {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <RecentMessages />
      <QuickOverview />
    </section>
  );
}
