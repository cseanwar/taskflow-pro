'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { ITask } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: ITask[];
  canAddTask?: boolean;
  canDrag?: boolean;
  onAddTask: (columnId: string) => void;
  onSelectTask: (task: ITask) => void;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  canAddTask = true,
  canDrag = true,
  onAddTask,
  onSelectTask,
}: KanbanColumnProps) {
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'backlog':
        return 'border-t-slate-500 text-slate-400';
      case 'todo':
        return 'border-t-sky-500 text-sky-400';
      case 'in_progress':
        return 'border-t-amber-500 text-amber-400';
      case 'review':
        return 'border-t-purple-500 text-purple-400';
      case 'testing':
        return 'border-t-pink-500 text-pink-400';
      case 'done':
        return 'border-t-emerald-500 text-emerald-400';
      default:
        return 'border-t-indigo-500 text-indigo-400';
    }
  };

  return (
    <div className={`flex w-72 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3 backdrop-blur-md border-t-2 ${getColumnColor(id)}`}>
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-800 px-1.5 text-[10px] font-bold text-slate-300">
            {tasks.length}
          </span>
        </div>
        {canAddTask && (
          <button
            onClick={() => onAddTask(id)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Add Task"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Droppable Task List Container */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[400px] flex-1 rounded-xl p-1 transition ${
              snapshot.isDraggingOver ? 'bg-indigo-950/20 border border-dashed border-indigo-500/30' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task._id} task={task} index={index} canDrag={canDrag} onClick={() => onSelectTask(task)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Button at bottom */}
      {canAddTask && (
        <button
          onClick={() => onAddTask(id)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-800 py-2 text-xs font-semibold text-slate-400 transition hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-300"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
