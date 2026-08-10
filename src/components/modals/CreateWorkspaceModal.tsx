'use client';

import React, { useState } from 'react';
import { X, Upload, Building2, Loader2 } from 'lucide-react';
import { createWorkspaceAction } from '@/actions/workspace.actions';
import { imageUploadInImgBB } from '@/utilities/ImgUploadInImgBB';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await imageUploadInImgBB(file);
      if (url) {
        setLogoUrl(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    if (logoUrl) formData.set('logo', logoUrl);

    const result = await createWorkspaceAction(formData);

    setLoading(false);
    if (result.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(result.message || 'Failed to create workspace.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Create New Workspace</h3>
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
            <label className="block text-xs font-semibold text-slate-300">Workspace Name *</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Acme Corporation"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Brief overview of your team or organization..."
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Workspace Logo</label>
            <div className="mt-1.5 flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-cover border border-slate-700" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                  <Building2 className="h-5 w-5" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
                <Upload className="h-4 w-4 text-indigo-400" />
                <span>Upload via ImgBB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
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
              <span>Create Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
