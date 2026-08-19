import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCreateTaskModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  isCreateWorkspaceModalOpen: boolean;
  isCreateSprintModalOpen: boolean;
  isInviteMemberModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  isSidebarMobileOpen: boolean;
}

const initialState: UIState = {
  isCreateTaskModalOpen: false,
  isCreateProjectModalOpen: false,
  isCreateWorkspaceModalOpen: false,
  isCreateSprintModalOpen: false,
  isInviteMemberModalOpen: false,
  isCommandPaletteOpen: false,
  isSidebarMobileOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCreateTaskModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateTaskModalOpen = action.payload;
    },
    setCreateProjectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateProjectModalOpen = action.payload;
    },
    setCreateWorkspaceModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateWorkspaceModalOpen = action.payload;
    },
    setCreateSprintModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateSprintModalOpen = action.payload;
    },
    setInviteMemberModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isInviteMemberModalOpen = action.payload;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    setSidebarMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarMobileOpen = action.payload;
    },
    toggleSidebarMobile: (state) => {
      state.isSidebarMobileOpen = !state.isSidebarMobileOpen;
    },
  },
});

export const {
  setCreateTaskModalOpen,
  setCreateProjectModalOpen,
  setCreateWorkspaceModalOpen,
  setCreateSprintModalOpen,
  setInviteMemberModalOpen,
  setCommandPaletteOpen,
  toggleCommandPalette,
  setSidebarMobileOpen,
  toggleSidebarMobile,
} = uiSlice.actions;

export default uiSlice.reducer;
