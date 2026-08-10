'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Upload, Loader2 } from 'lucide-react';
import { createTaskAction } from '@/actions/task.actions';
import { imageUploadInImgBB } from '@/utilities/ImgUploadInImgBB';
import { ISprint, IUser } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sprints?: ISprint[];
  members?: Partial<IUser>[];
  onSuccess?: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, projectId, sprints = [], members = [], onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; name: string; url: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await imageUploadInImgBB(file);
      if (url) {
        setAttachments(prev => [...prev, { id: Date.now().toString(), name: file.name, url }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const columnId = formData.get('columnId') as string;
    const sprintId = formData.get('sprintId') as string;
    const dueDate = formData.get('dueDate') as string;
    const labelInput = formData.get('labels') as string;

    const labels = labelInput ? labelInput.split(',').map(l => l.trim()).filter(Boolean) : [];

    const result = await createTaskAction({
      projectId,
      title,
      description,
      priority,
      columnId: columnId || 'todo',
      sprintId: sprintId && sprintId !== 'none' ? sprintId : null,
      dueDate: dueDate || null,
      labels,
      attachments,
    });

    setLoading(false);
    if (result.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(result.message || 'Failed to create task.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Create New Task</h3>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300">Task Title *</label>
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. Design Landing Page Hero Section"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Column / Status</label>
              <select
                name="columnId"
                defaultValue="todo"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300">Priority Level</label>
              <select
                name="priority"
                defaultValue="Medium"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Sprint</label>
              <select
                name="sprintId"
                defaultValue="none"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="none">No Sprint (Backlog)</option>
                {sprints.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300">Due Date</label>
              <input
                name="dueDate"
                type="date"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Labels (comma separated)</label>
            <input
              name="labels"
              type="text"
              placeholder="e.g. Frontend, Bug, UI/UX"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detailed description, requirements, or acceptance criteria..."
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* ImgBB Attachment Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300">Attachments</label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                  <span className="truncate max-w-[120px]">{att.name}</span>
                </div>
              ))}
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-500 hover:text-indigo-400">
                {uploadingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                <span>Attach Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
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
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
