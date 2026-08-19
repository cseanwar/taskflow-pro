import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask, ISprint, TaskPriority } from '@/types';

interface KanbanFilterState {
  searchQuery: string;
  selectedSprint: string;
  selectedPriority: string;
}

interface KanbanState {
  tasks: ITask[];
  sprints: ISprint[];
  selectedTask: ITask | null;
  filters: KanbanFilterState;
  defaultColumn: string;
  loading: boolean;
}

const initialState: KanbanState = {
  tasks: [],
  sprints: [],
  selectedTask: null,
  filters: {
    searchQuery: '',
    selectedSprint: 'all',
    selectedPriority: 'all',
  },
  defaultColumn: 'todo',
  loading: false,
};

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<ITask[]>) => {
      state.tasks = action.payload;
    },
    setSprints: (state, action: PayloadAction<ISprint[]>) => {
      state.sprints = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<ITask | null>) => {
      state.selectedTask = action.payload;
    },
    setDefaultColumn: (state, action: PayloadAction<string>) => {
      state.defaultColumn = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setSelectedSprintFilter: (state, action: PayloadAction<string>) => {
      state.filters.selectedSprint = action.payload;
    },
    setSelectedPriorityFilter: (state, action: PayloadAction<string>) => {
      state.filters.selectedPriority = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        searchQuery: '',
        selectedSprint: 'all',
        selectedPriority: 'all',
      };
    },
    moveTaskOptimistic: (
      state,
      action: PayloadAction<{ taskId: string; columnId: string; newOrder: number }>
    ) => {
      const { taskId, columnId, newOrder } = action.payload;
      const taskIndex = state.tasks.findIndex(t => t._id === taskId);
      if (taskIndex !== -1) {
        const [movedTask] = state.tasks.splice(taskIndex, 1);
        movedTask.columnId = columnId;
        movedTask.order = newOrder;
        state.tasks.splice(newOrder, 0, movedTask);
      }
    },
    updateTaskInList: (state, action: PayloadAction<ITask>) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?._id === action.payload._id) {
        state.selectedTask = action.payload;
      }
    },
    removeTaskFromList: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
      if (state.selectedTask?._id === action.payload) {
        state.selectedTask = null;
      }
    },
  },
});

export const {
  setTasks,
  setSprints,
  setSelectedTask,
  setDefaultColumn,
  setSearchQuery,
  setSelectedSprintFilter,
  setSelectedPriorityFilter,
  resetFilters,
  moveTaskOptimistic,
  updateTaskInList,
  removeTaskFromList,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
