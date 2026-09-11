import { ChartsSection } from "../components/ChartsSection";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { StatCards } from "../components/StatCards";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardHeader />
          <StatCards />
          <ChartsSection />
        </div>
      </main>
    </div>
  );
}
