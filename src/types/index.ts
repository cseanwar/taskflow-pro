export type UserRole = 'Administrator' | 'Workspace Owner' | 'Project Manager' | 'Team Member' | 'Guest User';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SprintStatus = 'Planned' | 'Active' | 'Completed';

export interface INotificationPrefs {
  taskAssigned: { email: boolean; push: boolean };
  comments: { email: boolean; push: boolean };
  projectUpdates: { email: boolean; push: boolean };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'suspended';
  jobTitle?: string;
  department?: string;
  notificationPrefs?: INotificationPrefs;
}

export interface IWorkspaceMember {
  userId: string;
  role: UserRole;
  joinedAt?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface IWorkspace {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: string;
  members: IWorkspaceMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProjectMemberRole {
  userId: string;
  role: UserRole;
}

export interface IProject {
  _id: string;
  workspaceId: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
  status: 'active' | 'archived';
  managerId: string;
  members: string[];
  memberRoles?: IProjectMemberRole[];
  features?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
  board?: any;
}

export interface IChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ITaskAttachment {
  id: string;
  name: string;
  url: string;
  uploadedAt?: string;
}

export interface ITask {
  _id: string;
  projectId: string;
  key?: string; // Sequential per-project key, e.g. "TF-1"
  columnId: string; // backlog, todo, in_progress, review, testing, done
  sprintId?: string | null;
  title: string;
  description?: string;
  priority: TaskPriority;
  estimate?: number | null; // Story points
  dueDate?: string | null;
  assigneeIds: string[];
  assignees?: Partial<IUser>[];
  reporterId: string;
  reporter?: Partial<IUser>;
  labels: string[];
  attachments?: ITaskAttachment[];
  checklist?: IChecklistItem[];
  order: number;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISprint {
  _id: string;
  projectId: string;
  name: string;
  goal?: string;
  startDate?: string | null;
  endDate?: string | null;
  status: SprintStatus;
  createdAt?: string;
}

export interface IComment {
  _id: string;
  taskId: string;
  authorId: string;
  author?: {
    name: string;
    avatar?: string;
  };
  text: string;
  attachments?: string[];
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: 'assignment' | 'task_update' | 'due_date' | 'comment' | 'invitation';
  title: string;
  message: string;
  read: boolean;
  archived?: boolean;
  actorId?: string;
  actor?: {
    name: string;
    avatar?: string;
  };
  link?: string;
  createdAt: string;
}

export interface IActivityLog {
  _id: string;
  projectId?: string | null;
  taskId?: string | null;
  actorId: string;
  actor?: {
    name: string;
    avatar?: string;
  };
  action: string;
  details?: string;
  project?: {
    name: string;
    code?: string;
  } | null;
  createdAt: string;
}

export interface IDashboardStats {
  activeWorkspaces: number;
  activeProjects: number;
  totalTasks: number;
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  priorityStats: { priority: string; count: number }[];
  statusStats: { status: string; count: number }[];
}

export interface IRecentProject {
  _id: string;
  name: string;
  code: string;
  category?: string;
  description?: string;
  progress: number;
  totalTasks: number;
  openTasks: number;
  nextDueDate?: string | null;
  daysLeft?: number | null;
  updatedAt?: string;
}

export interface IUpcomingTask {
  _id: string;
  key?: string;
  title: string;
  priority: TaskPriority;
  columnId: string;
  dueDate?: string | null;
  dueLabel?: string;
  projectId: string;
  projectName: string;
  projectCode: string;
}

export interface IUserDashboard {
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksDueToday: number;
  assignedTasks: number;
  recentProjects: IRecentProject[];
  upcomingTasks: IUpcomingTask[];
  recentActivity: IActivityLog[];
}

export interface IReportProject {
  _id: string;
  name: string;
  code: string;
  category?: string;
  status: string;
  workspaceId: string;
  workspaceName: string;
}

export interface IVelocityEntry {
  sprintId: string;
  name: string;
  status: string;
  committed: number;
  completed: number;
  committedPoints: number;
  completedPoints: number;
}

export interface ITeamWorkloadMember {
  userId: string;
  name: string;
  avatar?: string;
  totalTasks: number;
  completedTasks: number;
  openTasks: number;
  byColumn: Record<string, number>;
  progress: number;
  capacity: number;
  workloadPercent: number;
  allocation: 'over' | 'high' | 'under' | 'ok';
}

export interface ITeamProductivityMember {
  userId: string;
  name: string;
  avatar?: string;
  completedFeatures: number;
  completedBugs: number;
  openFeatures: number;
  openBugs: number;
  totalCompleted: number;
  totalOpen: number;
  completionRate: number;
}

export interface IProjectOverview {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  openTasks: number;
  completionRate: number;
  tasksDueSoon: number;
  statusStats: Record<string, number>;
  velocity: IVelocityEntry[];
  teamWorkload: ITeamWorkloadMember[];
  teamProductivity: ITeamProductivityMember[];
  cycleTimeDays: number;
  activeSprint: { id: string; name: string; startDate?: string | null; endDate?: string | null } | null;
  timeRemainingDays: number | null;
  timeRemainingLabel: string | null;
  recentActivity: IActivityLog[];
}

export interface ISearchResults {
  tasks: {
    _id: string;
    key?: string;
    title: string;
    priority: TaskPriority;
    columnId: string;
    sprintId?: string | null;
    dueDate?: string | null;
    estimate?: number | null;
    projectId: string;
    projectName: string;
    projectCode: string;
    assigneeIds: string[];
  }[];
  projects: {
    _id: string;
    name: string;
    code: string;
    category?: string;
    status: string;
  }[];
  members: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  }[];
}
