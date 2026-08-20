# TaskFlow Pro — A Full-Stack Project Management & Team Collaboration System

<div align="center">

**Frontend for TaskFlow Pro: a Kanban / sprint project-management app built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Redux Toolkit (RTK) and TypeScript.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[Quick Start](#getting-started) • [Architecture](#architecture) • [State Management](#state-management-redux-toolkit) • [Key Routes](#application-routes) • [Scripts](#available-scripts)

</div>

---

## 📌 Overview

The **TaskFlow Pro Client** is built on **Next.js 16 App Router**, **React 19**, **Tailwind CSS v4**, and **Redux Toolkit (RTK)**. It communicates with the backend REST API via Next.js Server Actions with automatic `httpOnly` cookie authentication and Bearer JWT authorization.

### Key Capabilities
* **Interactive Drag-and-Drop Kanban**: Physics-based board powered by `@hello-pangea/dnd` and optimistic updates in Redux.
* **Agile Sprint Lifecycle**: Visual backlog allocation, active sprint burndown, and velocity reports.
* **Global Command Palette (`⌘K`)**: Fast, keyboard-first search navigating directly to tasks, projects, or team members.
* **Team Management & Role Delegation**: Workspace member invites, role level switches, and activity auditing.
* **Multi-Theme Experience**: Zero-flicker ThemeProvider supporting Light, Dark, and System modes.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** `>= 18.0.0`
* **npm** `>= 9.0.0`
* **TaskFlow Pro Backend API** running on `http://localhost:5000` (see [Server README](https://github.com/cseanwar/taskflow-pro-server.git/README.md))

### 1. Installation
```bash
# Navigate to client directory
git clone https://github.com/cseanwar/taskflow-pro.git
cd taskflow-pro

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Create `.env` in `taskflow-pro/`:

```env
# Backend API Base URL (no trailing /api suffix; fetchWithAuth appends /api)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Google OAuth 2.0 Web Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### 3. Run Development Server
```bash
npm run dev
# App running on http://localhost:3000
```

---

## 🛠 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Turbopack development server on `http://localhost:3000` |
| **Build** | `npm run build` | Compiles production bundle and typechecks with `tsc` |
| **Start** | `npm run start` | Serves the optimized production build |
| **Lint** | `npm run lint` | Runs ESLint analysis across the project |

---

## 🏛 Architecture & Code Structure

```
src/
├── actions/                  # 'use server' Server Actions (fetchWithAuth bridge)
│   ├── auth.actions.ts       # Login, register, Google auth, profile updates
│   ├── workspace.actions.ts  # Workspace CRUD, invites, member roles
│   ├── project.actions.ts    # Project CRUD, board initialization
│   ├── task.actions.ts       # Task CRUD, column moves, comments, checklists
│   ├── sprint.actions.ts     # Sprint lifecycle (Planned → Active → Completed)
│   ├── analytics.actions.ts  # KPIs, velocity, and workload metrics
│   ├── notification.actions.ts # Notification feeds and read receipts
│   └── search.actions.ts     # Global multi-entity search
│
├── app/                      # Next.js 16 App Router
│   ├── (auth)/               # Login & Register views
│   ├── dashboard/            # Executive summary & quick actions
│   ├── workspaces/[id]/      # Workspace project grids & settings
│   ├── projects/[id]/        # Kanban board & sprint filters
│   │   └── settings/         # Project configuration & archiving
│   ├── calendar/             # Deadline schedule view
│   ├── reports/              # Performance & velocity reports (Recharts)
│   ├── team/                 # Workspace members & permissions
│   ├── notifications/        # Live notification center
│   ├── settings/appearance/  # Theme & display preferences
│   ├── not-found.tsx         # Branded 404 page
│   └── layout.tsx            # Root layout with Redux & Theme Providers
│
├── components/               # Modular UI Components
│   ├── kanban/               # KanbanBoard, KanbanColumn, TaskCard, TaskDetailDrawer
│   ├── layout/               # Navbar, Sidebar, ThemeToggle
│   ├── modals/               # CreateTaskModal, CreateProjectModal, InviteMemberModal
│   ├── command/              # CommandPalette (⌘K)
│   ├── dashboard/            # AnalyticsCharts & KPI widgets
│   ├── reports/              # ReportsView, VelocityChart, ProductivityTable
│   └── shared/               # AppShell, AccessDenied (403), PageHeader
│
├── lib/                      # Core Utilities
│   ├── api.ts                # fetchWithAuth HTTP abstraction with JWT cookie injection
│   ├── permissions.ts        # Client-side 5-tier RBAC mirror
│   ├── theme.tsx             # React Theme Context (Light / Dark / System)
│   └── theme-script.ts       # Synchronous pre-paint head script
│
├── redux/                    # Redux Toolkit Global State
│   ├── store.ts              # makeStore() root configuration
│   ├── hooks.ts              # useAppDispatch, useAppSelector, useAppStore
│   ├── provider.tsx          # Client ReduxProvider wrapper
│   └── slices/               # authSlice, workspaceSlice, kanbanSlice, notificationSlice, uiSlice
│
└── types/                    # Shared TypeScript interfaces & models
```

---

## ⚡ State Management (Redux Toolkit)

Global state is managed via Redux Toolkit (`@reduxjs/toolkit` + `react-redux`):

* **`authSlice`**: Active authenticated user, profile details, and session status.
* **`workspaceSlice`**: Workspaces array, current active workspace, member rosters, and audit activity.
* **`kanbanSlice`**: Project tasks, optimistic column re-ordering, active drawer item, priority filters, sprint filters, and keyword searches.
* **`notificationSlice`**: Notification items and unread count badge.
* **`uiSlice`**: Global modal visibility (Tasks, Projects, Workspaces, Sprints) and mobile sidebar drawer.

---

## 🔒 Client-Side RBAC Mirror

The client mirrors the backend 5-level role model via `src/lib/permissions.ts`:

```typescript
export const LEVEL = {
  read: 1,       // Guest User +: view shared boards and tasks
  contribute: 2, // Team Member +: move cards, check items, post comments
  manage: 3,     // Project Manager +: create/edit projects, tasks, sprints, reports
  admin: 4,      // Workspace Owner +: invite/remove members, update workspace
  platform: 5,   // Administrator: platform-wide user status management
} as const;
```

---

## 🚢 Deployment

1. Set up on **Vercel** selecting the `Next.js` framework preset.
2. Set Environment Variable: `NEXT_PUBLIC_API_URL` to your production backend API URL (e.g. `https://your-api.vercel.app`).
3. For Google OAuth, register your production origin in the Google Cloud Console Authorized JavaScript Origins.