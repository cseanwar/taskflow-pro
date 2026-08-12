import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Kanban, ArrowRight, Search, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found – TaskFlow Pro",
  description: "This ticket fell off the board. The page you're looking for doesn't exist.",
  robots: { index: false, follow: true },
};

const MONO = "[font-family:var(--font-jetbrains),ui-monospace,monospace]";
const COLUMNS = ["Backlog", "In Progress", "In Review", "Done"];

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Film grain + dotted backdrop + brand glows */}
      <div className="lp-grain" />
      <div className="app-dotgrid absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 42% at 70% 12%, rgba(99,102,241,0.16), transparent 70%), radial-gradient(36% 36% at 14% 86%, rgba(99,102,241,0.10), transparent 70%), radial-gradient(28% 28% at 50% 50%, rgba(99,102,241,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-8 pb-10 sm:px-10">
        {/* Brand */}
        <div className="rise flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
            <Kanban className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-100">
            TaskFlow <span className="text-indigo-400">Pro</span>
          </span>
        </div>

        {/* Centre stage */}
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          {/* Orphaned ticket */}
          <div className="rise notfound-float relative mx-auto w-full max-w-sm" style={{ animationDelay: "120ms" }}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 text-left shadow-2xl shadow-indigo-950/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className={`rounded-md bg-indigo-600/15 px-2 py-0.5 ${MONO} text-[11px] font-bold tracking-widest text-indigo-400`}>
                  TFP-404
                </span>
                <span className={`rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 ${MONO} text-[10px] font-bold tracking-widest text-rose-400`}>
                  LOST
                </span>
              </div>
              <p className="mt-3.5 text-sm font-bold text-slate-100">
                Page not found
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                This task was never assigned to a column.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1.5">
                    <Image
                      width={18}
                      height={18}
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=ghost"
                      alt=""
                      className="h-5 w-5 rounded-full border border-slate-800 bg-slate-800 object-cover"
                    />
                    <Image
                      width={18}
                      height={18}
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=404"
                      alt=""
                      className="h-5 w-5 rounded-full border border-slate-800 bg-slate-800 object-cover"
                    />
                  </span>
                  <span className="text-[10px] text-slate-500">Unassigned</span>
                </div>
                <span className={MONO + " text-[10px] text-slate-600"}>0 comments</span>
              </div>
            </div>

            {/* Empty drop target */}
            <div className="mx-3 -mt-1.5 rounded-xl border-2 border-dashed border-slate-700/80 py-2 text-center">
              <span className={`${MONO} text-[9px] tracking-[0.22em] text-slate-600 uppercase`}>
                drop target — no column exists
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="rise font-display mt-10 text-5xl font-black tracking-tight text-slate-100 sm:text-6xl lg:text-7xl" style={{ animationDelay: "240ms" }}>
            This ticket fell
            <span className="block text-indigo-500">off the board.</span>
          </h1>

          {/* Copy */}
          <p className="rise mt-5 max-w-xl text-sm leading-relaxed text-slate-400" style={{ animationDelay: "360ms" }}>
            The page you&apos;re looking for isn&apos;t assigned to any sprint. It may have
            been moved, archived, or never created in the first place.
          </p>

          {/* Actions */}
          <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "480ms" }}>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-lg"
            >
              Back to Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/search"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-indigo-500/50 hover:text-indigo-300"
            >
              <Search className="h-3.5 w-3.5" />
              Search the board
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:text-slate-200"
            >
              <Home className="h-3.5 w-3.5" />
              Homepage
            </Link>
          </div>

          {/* Column legend */}
          <div className="rise mt-12 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2" style={{ animationDelay: "600ms" }}>
            {COLUMNS.map(col => (
              <span key={col} className={`${MONO} text-[9px] tracking-[0.2em] text-slate-500 uppercase`}>
                {col}
              </span>
            ))}
            <span className="text-slate-700">›</span>
            <span className={`rounded border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 ${MONO} text-[9px] font-bold tracking-[0.2em] text-rose-400 uppercase`}>
              ? missing
            </span>
          </div>
        </div>

        {/* Footer status */}
        <div className="rise flex items-center justify-center gap-2" style={{ animationDelay: "720ms" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 glow-dot" />
          <span className={`${MONO} text-[10px] tracking-[0.2em] text-slate-600 uppercase`}>
            HTTP 404 · page not found · taskflow.pro
          </span>
        </div>
      </div>
    </main>
  );
}