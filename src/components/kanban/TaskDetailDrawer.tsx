'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  CheckSquare, 
  MessageSquare, 
  Paperclip, 
  Send,
  Upload,
  Plus,
  Loader2,
  Clock
} from 'lucide-react';
import { updateTaskAction, deleteTaskAction, getTaskCommentsAction, addCommentAction } from '@/actions/task.actions';
import { imageUploadInImgBB } from '@/utilities/ImgUploadInImgBB';
import { ITask, IComment, ISprint, IUser } from '@/types';

interface Props {
  task: ITask | null;
  projectId: string;
  sprints?: ISprint[];
  members?: Partial<IUser>[];
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

export default function TaskDetailDrawer({ task, projectId, sprints = [], members = [], onClose, onUpdateSuccess }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [checklist, setChecklist] = useState(task?.checklist || []);
  const [newItemText, setNewItemText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (task) {
      setChecklist(task.checklist || []);
      fetchComments();
    }
  }, [task]);

  if (!task) return null;

  const fetchComments = async () => {
    const res = await getTaskCommentsAction(task._id);
    setComments(res);
  };

  const handleUpdateField = async (field: string, value: any) => {
    await updateTaskAction(task._id, projectId, { [field]: value });
    if (onUpdateSuccess) onUpdateSuccess();
  };

  const handleToggleChecklist = async (id: string) => {
    const updated = checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setChecklist(updated);
    await handleUpdateField('checklist', updated);
  };

  const handleAddChecklistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = { id: Date.now().toString(), text: newItemText.trim(), completed: false };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewItemText('');
    await handleUpdateField('checklist', updated);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoadingComment(true);
    const res = await addCommentAction(task._id, projectId, newComment.trim());
    setLoadingComment(false);
    if (res.success) {
      setNewComment('');
      fetchComments();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await imageUploadInImgBB(file);
      if (url) {
        const newAtt = { id: Date.now().toString(), name: file.name, url };
        const updated = [...(task.attachments || []), newAtt];
        await handleUpdateField('attachments', updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    await deleteTaskAction(task._id, projectId);
    setDeleting(false);
    onClose();
    if (onUpdateSuccess) onUpdateSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl border-l border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-indigo-600/20 px-2.5 py-1 text-xs font-bold text-indigo-400">
                TASK-{task._id.substring(task._id.length - 4)}
              </span>
              <select
                value={task.columnId}
                onChange={e => handleUpdateField('columnId', e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteTask}
                disabled={deleting}
                className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-500/10"
                title="Delete Task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Task Title */}
          <div className="mt-4">
            <input
              type="text"
              defaultValue={task.title}
              onBlur={e => handleUpdateField('title', e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1"
            />
          </div>

          {/* Quick Properties Bar */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Priority</span>
              <select
                value={task.priority}
                onChange={e => handleUpdateField('priority', e.target.value)}
                className="w-full bg-transparent font-semibold text-slate-200 focus:outline-none"
              >
                <option value="Low" className="bg-slate-900">Low</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="High" className="bg-slate-900">High</option>
                <option value="Urgent" className="bg-slate-900">Urgent</option>
              </select>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Sprint</span>
              <select
                value={task.sprintId || 'none'}
                onChange={e => handleUpdateField('sprintId', e.target.value === 'none' ? null : e.target.value)}
                className="w-full bg-transparent font-semibold text-slate-200 focus:outline-none"
              >
                <option value="none" className="bg-slate-900">Backlog</option>
                {sprints.map(s => (
                  <option key={s._id} value={s._id} className="bg-slate-900">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Due Date</span>
              <input
                type="date"
                defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                onChange={e => handleUpdateField('dueDate', e.target.value || null)}
                className="w-full bg-transparent font-semibold text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
            <textarea
              defaultValue={task.description || ''}
              onBlur={e => handleUpdateField('description', e.target.value)}
              rows={3}
              placeholder="Add detailed task description..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Checklist Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Checklist</h4>
              <span className="text-[11px] text-slate-500">
                {checklist.filter(c => c.completed).length}/{checklist.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span className={`flex-1 text-slate-200 ${item.completed ? 'line-through text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddChecklistItem} className="mt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Attachments Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Attachments</h4>
              <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800">
                {uploadingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3 text-indigo-400" />}
                <span>Upload ImgBB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {task.attachments?.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-xs text-indigo-400 hover:bg-slate-800"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  <span className="truncate">{att.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Activity Comments Section */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Activity & Comments</h4>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {comments.map(c => (
                <div key={c._id} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs">
                  <img
                    src={c.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.name || 'User'}`}
                    alt="User"
                    className="h-7 w-7 rounded-full bg-slate-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{c.author?.name || 'User'}</span>
                      <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="mt-1 text-slate-300">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loadingComment}
                className="flex items-center justify-center rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {loadingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
