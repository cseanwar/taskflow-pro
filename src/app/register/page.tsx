'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Kanban, Lock, Mail, User, Shield, Loader2 } from 'lucide-react';
import { registerAction } from '@/actions/auth.actions';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
            <Kanban className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">Create Account</h2>
          <p className="mt-1 text-xs text-slate-400">Join TaskFlow Pro to manage projects effortlessly</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300">Full Name *</label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                name="name"
                type="text"
                required
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Email Address *</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                name="email"
                type="email"
                required
                placeholder="alex@company.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Password *</label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Primary Role</label>
            <div className="relative mt-1.5">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                name="role"
                defaultValue="Workspace Owner"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-9 pr-4 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Workspace Owner">Workspace Owner</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Team Member">Team Member</option>
                <option value="Administrator">Administrator</option>
                <option value="Guest User">Guest User</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
