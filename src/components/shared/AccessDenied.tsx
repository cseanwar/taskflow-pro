import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Home, Kanban, KeyRound, Lock } from 'lucide-react';
import { LEVEL, levelOf } from '@/lib/permissions';
import type { UserRole } from '@/types';

interface AccessDeniedProps {
  role?: string | null;
  required?: string;
}

/**
 * Role-aware "insufficient privileges" screen. Shown instead of a silent
 * redirect so users understand why a route was withheld and how access is granted.
 * Visual language matches the /404 "orphaned ticket" page — a sealed kanban column.
 */
export default function AccessDenied({ role, required = 'Project Manager' }: AccessDeniedProps) {
  const MONO = "[font-family:var(--font-jetbrains),ui-monospace,monospace]";

  const currentLevel = role ? levelOf(role as UserRole) : 0;
  const requiredLevel = levelOf(required as UserRole) || LEVEL.manage;
  const denied = currentLevel < requiredLevel;
  const fillPct = (Math.max(0, Math.min(currentLevel, LEVEL.platform)) / LEVEL.platform) * 100;
  const tickPct = ((requiredLevel - LEVEL.read) / (LEVEL.platform - LEVEL.read)) * 100;

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
            "radial-gradient(42% 42% at 70% 12%, rgba(99,102,241,0.16), transparent 70%), radial-gradient(36% 36% at 14% 86%, rgba(99,102,241,0.10), transparent 70%), radial-gradient(28% 28% at 50% 50%, rgba(245,158,11,0.07), transparent 70%)",
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
          {/* Sealed ticket */}
          <div className="rise notfound-float relative mx-auto w-full max-w-sm" style={{ animationDelay: '120ms' }}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 text-left shadow-2xl shadow-indigo-950/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className={`rounded-md bg-indigo-600/15 px-2 py-0.5 ${MONO} text-[11px] font-bold tracking-widest text-indigo-400`}>
                  TFP-403
                </span>
                <span className={`rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 ${MONO} text-[10px] font-bold tracking-widest text-amber-400`}>
                  LOCKED
                </span>
              </div>
              <p className="mt-3.5 text-sm font-bold text-slate-100">Restricted column</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                This ticket is sealed behind role-based access.
              </p>

              {/* Frosted preview */}
              <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                <div aria-hidden className="select-none space-y-2 p-4 blur-[2.5px]">
                  <div className="h-2 w-3/4 rounded-full bg-slate-700" />
                  <div className="h-2 w-full rounded-full bg-slate-800" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-800" />
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-slate-700" />
                    <div className="h-2 w-1/3 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30">
                    <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className={`${MONO} text-[8px] font-bold tracking-[0.28em] text-amber-300 uppercase`}>
                    Restricted
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1.5">
                    <Image
                      width={18}
                      height={18}
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=guard"
                      alt=""
                      className="h-5 w-5 rounded-full border border-slate-800 bg-slate-800 object-cover"
                    />
                    <Image
                      width={18}
                      height={18}
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=403"
                      alt=""
                      className="h-5 w-5 rounded-full border border-slate-800 bg-slate-800 object-cover"
                    />
                  </span>
                  <span className="text-[10px] text-slate-500">Role: {role || 'Guest'}</span>
                </div>
                <span className={MONO + " text-[10px] text-slate-600"}>{required}+ only</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="rise font-display mt-10 text-5xl font-black tracking-tight text-slate-100 sm:text-6xl lg:text-7xl" style={{ animationDelay: '240ms' }}>
            This column is
            <span className="block text-amber-400">locked.</span>
          </h1>

          {/* Copy */}
          <p className="rise mt-5 max-w-xl text-sm leading-relaxed text-slate-400" style={{ animationDelay: '360ms' }}>
            This area is sealed by workspace permissions. It&apos;s visible only to{' '}
            <span className="font-semibold text-slate-200">{required}</span>s and above — a
            workspace owner can raise your role from the Team settings.
          </p>

          {/* Clearance meter */}
          <div className="rise mx-auto mt-10 w-full max-w-sm text-left" style={{ animationDelay: '480ms' }}>
            <div className="flex items-center justify-between">
              <span className={`${MONO} text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase`}>
                Workspace clearance
              </span>
              <span className={`${MONO} text-[10px] text-slate-500`}>
                {currentLevel > 0 ? `${role} · L${currentLevel}` : 'no session'}
              </span>
            </div>
            <div className="relative mt-3 h-2 rounded-full bg-slate-800/80">
              <div
                className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r transition-all ${
                  denied ? 'from-amber-600/80 to-amber-400/80' : 'from-indigo-600 to-indigo-400'
                }`}
                style={{ width: `${fillPct}%` }}
              />
              <div
                role="img"
                aria-label={`Required clearance: ${required}+`}
                title={`Required clearance: ${required}+`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${tickPct}%` }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-amber-400 text-slate-950 shadow-lg shadow-black/40">
                  <Lock className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`${MONO} text-[9px] tracking-[0.18em] text-slate-600 uppercase`}>read</span>
              <span className={`${MONO} text-[9px] font-bold tracking-[0.18em] text-amber-400 uppercase`}>
                required {required}+
              </span>
              <span className={`${MONO} text-[9px] tracking-[0.18em] text-slate-600 uppercase`}>platform</span>
            </div>
          </div>

          {/* Actions */}
          <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '600ms' }}>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-lg"
            >
              Back to Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Request access
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:text-slate-200"
            >
              <Home className="h-3.5 w-3.5" />
              Homepage
            </Link>
          </div>
        </div>

        {/* Footer status */}
        <div className="rise flex items-center justify-center gap-2" style={{ animationDelay: '720ms' }}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 glow-dot" />
          <span className={`${MONO} text-[10px] tracking-[0.2em] text-slate-600 uppercase`}>
            HTTP 403 · forbidden · role-gated route
          </span>
        </div>
      </div>
    </main>
  );
}
