import React from 'react';
import Link from 'next/link';
import { 
  Kanban, 
  Zap, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { getCurrentUserAction } from '@/actions/auth.actions';

export default async function LandingPage() {
  const user = await getCurrentUserAction();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
              <Kanban className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TaskFlow <span className="text-indigo-400">Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 transition hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 text-center">
        <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        
        <div className="mx-auto max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Full-Stack SaaS Project Management & Team Collaboration</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            Streamline Projects, Sprints & Team Workflows in <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">One Place</span>
          </h1>

          <p className="mt-6 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Inspired by Jira and Trello. Empower software development teams, agencies, and startups with interactive Kanban drag-and-drop boards, sprint planning, real-time analytics, and role-based access control.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/register'}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-xl shadow-indigo-600/25"
            >
              <span>{user ? 'Open Dashboard' : 'Start Free Workspace'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mx-auto max-w-6xl px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-indigo-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Kanban Boards</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Drag-and-drop tasks across Backlog, To Do, In Progress, Review, Testing, and Done columns with instant order updates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-indigo-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Agile Sprint Management</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Plan sprints, assign backlog items, set sprint goals, start and monitor active sprint velocity with reports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-indigo-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Analytics</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Interactive reports using Recharts displaying completion rates, priority distributions, and team productivity stats.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 TaskFlow Pro SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
