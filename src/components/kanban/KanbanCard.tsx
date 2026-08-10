'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Paperclip, CheckSquare, MessageSquare, AlertCircle } from 'lucide-react';
import { ITask } from '@/types';

interface KanbanCardProps {
  task: ITask;
  index: number;
  onClick: () => void;
}

export default function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'badge-urgent';
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      case 'Low':
        return 'badge-low';
      default:
        return 'badge-medium';
    }
  };

  const completedChecklist = task.checklist?.filter(c => c.completed).length || 0;
  const totalChecklist = task.checklist?.length || 0;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`glass-card group relative mb-3 cursor-pointer rounded-xl p-3.5 shadow-sm transition ${
            snapshot.isDragging ? 'rotate-2 scale-105 border-indigo-500 shadow-2xl z-50' : ''
          }`}
        >
          {/* Priority & Code */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityBadgeClass(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              {task.key && (
                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wide text-slate-500">
                  {task.key}
                </span>
              )}
            </div>
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.slice(0, 2).map((label, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-300"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h4 className="mt-2 text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition line-clamp-2">
            {task.title}
          </h4>

          {/* Cover image if available */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="mt-2.5 overflow-hidden rounded-lg border border-slate-800 max-h-28">
              <img src={task.attachments[0].url} alt="Cover" className="w-full object-cover" />
            </div>
          )}

          {/* Meta indicators */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {totalChecklist > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3 text-indigo-400" />
                  <span>
                    {completedChecklist}/{totalChecklist}
                  </span>
                </div>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3 text-slate-400" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>

            {/* Assignee Avatars */}
            <div className="flex -space-x-1.5 overflow-hidden">
              {task.assignees && task.assignees.length > 0 ? (
                task.assignees.map((assignee, idx) => (
                  <img
                    key={idx}
                    src={assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee.name || idx}`}
                    alt={assignee.name || 'User'}
                    className="inline-block h-5 w-5 rounded-full border border-slate-900 object-cover"
                    title={assignee.name}
                  />
                ))
              ) : (
                <div className="h-5 w-5 rounded-full bg-slate-800 text-[9px] flex items-center justify-center text-slate-400">
                  ?
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
