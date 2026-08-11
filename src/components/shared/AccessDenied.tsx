import Link from 'next/link';
import { ArrowLeft, KeyRound, UserRound } from 'lucide-react';

interface AccessDeniedProps {
  role?: string | null;
  required?: string;
}

/**
 * Role-aware "insufficient privileges" screen. Shown instead of a silent
 * redirect so users understand why a route was withheld and how access is granted.
 */
export default function AccessDenied({ role, required = 'Project Manager' }: AccessDeniedProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          {/* faint topographic grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 shadow-lg shadow-black/40">
              <KeyRound className="h-6 w-6 text-amber-400" />
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400/90">
              Restricted area
            </p>
            <h1 className="mt-2 text-xl font-extrabold text-white">You can&apos;t view this page</h1>
            <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
              This area is reserved for <span className="font-semibold text-slate-200">{required}</span>s,
              workspaces owners, and administrators. A workspace owner can raise your role via the
              team membership settings.
            </p>

            {role && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2">
                <UserRound className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[11px] font-semibold text-slate-400">
                  Current role: <span className="text-slate-200">{role}</span>
                </span>
              </div>
            )}

            <div className="mt-7">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/25"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}