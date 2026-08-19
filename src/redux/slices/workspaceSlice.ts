import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWorkspace, IActivityLog } from '@/types';

interface WorkspaceState {
  workspaces: IWorkspace[];
  activeWorkspaceId: string | null;
  activeWorkspace: IWorkspace | null;
  activity: IActivityLog[];
  loading: boolean;
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
  activeWorkspace: null,
  activity: [],
  loading: false,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<IWorkspace[]>) => {
      state.workspaces = action.payload;
      if (action.payload.length > 0 && !state.activeWorkspaceId) {
        state.activeWorkspaceId = action.payload[0]._id;
        state.activeWorkspace = action.payload[0];
      }
    },
    setActiveWorkspaceId: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
      state.activeWorkspace = state.workspaces.find(w => w._id === action.payload) || null;
    },
    setActiveWorkspace: (state, action: PayloadAction<IWorkspace | null>) => {
      state.activeWorkspace = action.payload;
      if (action.payload) {
        state.activeWorkspaceId = action.payload._id;
        const index = state.workspaces.findIndex(w => w._id === action.payload?._id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        } else {
          state.workspaces.push(action.payload);
        }
      }
    },
    addWorkspace: (state, action: PayloadAction<IWorkspace>) => {
      state.workspaces.unshift(action.payload);
      state.activeWorkspaceId = action.payload._id;
      state.activeWorkspace = action.payload;
    },
    updateWorkspaceInList: (state, action: PayloadAction<IWorkspace>) => {
      const index = state.workspaces.findIndex(w => w._id === action.payload._id);
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
      if (state.activeWorkspaceId === action.payload._id) {
        state.activeWorkspace = action.payload;
      }
    },
    setWorkspaceActivity: (state, action: PayloadAction<IActivityLog[]>) => {
      state.activity = action.payload;
    },
    setWorkspaceLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWorkspaces,
  setActiveWorkspaceId,
  setActiveWorkspace,
  addWorkspace,
  updateWorkspaceInList,
  setWorkspaceActivity,
  setWorkspaceLoading,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
