import { ActivitySection } from "../components/ActivitySection";
import { Sidebar } from "../components/Sidebar";

export default function ActivityPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="mb-8">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
							Suivi
						</p>
						<h1 className="mt-2 text-3xl font-bold text-white">Activité</h1>
						<p className="mt-2 text-slate-400">
							Consultez les messages récents et l’état général du portfolio.
						</p>
					</div>
					<ActivitySection />
				</div>
			</main>
		</div>
	);
}
