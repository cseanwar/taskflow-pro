'use client';

import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { inviteWorkspaceMemberAction } from '@/actions/workspace.actions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: () => void;
}

export default function InviteMemberModal({ isOpen, onClose, workspaceId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    const result = await inviteWorkspaceMemberAction(workspaceId, email, role);

    setLoading(false);
    if (result.success) {
      setSuccessMsg(result.message || 'Invitation sent successfully.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setError(result.message || 'Failed to invite member.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <UserPlus className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Invite Team Member</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300">Member Email Address *</label>
            <input
              name="email"
              type="email"
              required
              placeholder="teammate@company.com"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Assign Role</label>
            <select
              name="role"
              defaultValue="Team Member"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
              <option value="Guest User">Guest User (Read-only)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Send Invite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
