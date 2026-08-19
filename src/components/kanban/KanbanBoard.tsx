'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Filter, Search, Plus, Layers, Calendar, BarChart2, Settings } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import TaskDetailDrawer from './TaskDetailDrawer';
import CreateTaskModal from '../modals/CreateTaskModal';
import { moveTaskAction, getTasksByProjectAction } from '@/actions/task.actions';
import { ITask, ISprint, IProject } from '@/types';
import { ProjectPermissions } from '@/lib/permissions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setTasks,
  setSprints,
  setSelectedTask,
  setDefaultColumn,
  setSearchQuery,
  setSelectedSprintFilter,
  setSelectedPriorityFilter,
  moveTaskOptimistic,
} from '@/redux/slices/kanbanSlice';
import { setCreateTaskModalOpen } from '@/redux/slices/uiSlice';

interface KanbanBoardProps {
  project: IProject;
  initialTasks: ITask[];
  sprints?: ISprint[];
  permissions: ProjectPermissions;
}

export default function KanbanBoard({ project, initialTasks, sprints = [], permissions }: KanbanBoardProps) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.kanban.tasks);
  const selectedTask = useAppSelector((state) => state.kanban.selectedTask);
  const isCreateTaskOpen = useAppSelector((state) => state.ui.isCreateTaskModalOpen);
  const defaultColumn = useAppSelector((state) => state.kanban.defaultColumn);
  const { searchQuery, selectedSprint, selectedPriority } = useAppSelector((state) => state.kanban.filters);

  useEffect(() => {
    dispatch(setTasks(initialTasks));
    dispatch(setSprints(sprints));
  }, [dispatch, initialTasks, sprints]);

  const refreshTasks = async () => {
    const res = await getTasksByProjectAction(project._id);
    dispatch(setTasks(res));
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    if (!permissions.canContribute) return;

    // Optimistic UI update in Redux store
    dispatch(
      moveTaskOptimistic({
        taskId: draggableId,
        columnId: destination.droppableId,
        newOrder: destination.index,
      })
    );

    // Call Server Action
    await moveTaskAction(draggableId, project._id, destination.droppableId, destination.index);
  };

  // Filter tasks based on search & selectors
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSprint =
      selectedSprint === 'all' ||
      (selectedSprint === 'none' ? !task.sprintId : task.sprintId === selectedSprint);
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesSprint && matchesPriority;
  });

  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'testing', title: 'Testing' },
    { id: 'done', title: 'Done' },
  ];

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Board Header & Filtering Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30">
            {project.code || 'PRJ'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">{project.name} Board</h2>
            <p className="text-[11px] text-slate-400">{filteredTasks.length} Total Tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {permissions.isGuest && (
            <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">
              View Only
            </span>
          )}
          <span className="rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-[10px] font-semibold text-slate-400">
            Level {permissions.level}
          </span>
          {permissions.canManage && (
            <Link
              href={`/projects/${project._id}/settings`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition hover:border-indigo-500/40 hover:text-indigo-300"
            >
              <Settings className="h-3 w-3" />
              Settings
            </Link>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedSprint}
            onChange={e => dispatch(setSelectedSprintFilter(e.target.value))}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Sprints</option>
            <option value="none">Backlog (No Sprint)</option>
            {sprints.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={e => dispatch(setSelectedPriorityFilter(e.target.value))}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {permissions.canManage && (
            <button
              onClick={() => {
                dispatch(setDefaultColumn('todo'));
                dispatch(setCreateTaskModalOpen(true));
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag and Drop Kanban Board Area */}
      <div className="flex-1 overflow-x-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max pb-4">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={filteredTasks.filter(t => t.columnId === col.id)}
                canAddTask={permissions.canManage}
                canDrag={permissions.canContribute}
                onAddTask={colId => {
                  dispatch(setDefaultColumn(colId));
                  dispatch(setCreateTaskModalOpen(true));
                }}
                onSelectTask={task => dispatch(setSelectedTask(task))}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Details Drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          projectId={project._id}
          sprints={sprints}
          permissions={permissions}
          onClose={() => dispatch(setSelectedTask(null))}
          onUpdateSuccess={refreshTasks}
        />
      )}

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => dispatch(setCreateTaskModalOpen(false))}
          projectId={project._id}
          sprints={sprints}
          onSuccess={refreshTasks}
        />
      )}
    </div>
  );
}
