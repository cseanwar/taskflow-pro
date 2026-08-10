'use client';

import React, { useState } from 'react';
import { X, FolderKanban, Loader2 } from 'lucide-react';
import { createProjectAction } from '@/actions/project.actions';
import { IWorkspace } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaces: IWorkspace[];
  defaultWorkspaceId?: string;
  onSuccess?: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, workspaces, defaultWorkspaceId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createProjectAction(formData);

    setLoading(false);
    if (result.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(result.message || 'Failed to create project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <FolderKanban className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Create New Project</h3>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300">Select Workspace *</label>
            <select
              name="workspaceId"
              defaultValue={defaultWorkspaceId || workspaces[0]?._id}
              required
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {workspaces.map(w => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Project Name *</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Mobile App Redesign"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Project Key / Code</label>
              <input
                name="code"
                type="text"
                maxLength={6}
                placeholder="e.g. MAR"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 uppercase placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300">Category</label>
              <select
                name="category"
                defaultValue="Software"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Goals and details of this project..."
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
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
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
