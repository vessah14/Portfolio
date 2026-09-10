import { MessagesChart } from "./MessagesChart";
import { VisitsChart } from "./VisitsChart";

export function ChartsSection() {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <VisitsChart />
      <MessagesChart />
    </section>
  );
}
