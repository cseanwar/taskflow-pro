import { IUser, IWorkspace, UserRole } from '@/types';

/**
 * Client-side mirror of the server authorization model
 * (see project-management-server/src/middleware/authz.middleware.ts).
 * The server remains the source of truth; these helpers gate UI/navigation.
 */
export const ROLE_LEVEL: Record<UserRole, number> = {
  'Guest User': 1,
  'Team Member': 2,
  'Project Manager': 3,
  'Workspace Owner': 4,
  Administrator: 5,
};

export const LEVEL = {
  read: 1, // Guest + — view shared content
  contribute: 2, // Team Member + — update status, comment
  manage: 3, // Project Manager + — create/edit projects, tasks, sprints, reports
  admin: 4, // Workspace Owner + — workspace/member management
  platform: 5, // Administrator — user/suspension management
} as const;

export const levelOf = (role?: UserRole | null): number => (role ? (ROLE_LEVEL[role] ?? 0) : 0);

/** The member role for a user inside a workspace (ownerId implies 'Workspace Owner'). */
export const workspaceRoleOf = (
  workspace: Pick<IWorkspace, 'ownerId' | 'members'> | null | undefined,
  userId?: string
): UserRole | null => {
  if (!workspace || !userId) return null;
  if (workspace.ownerId === userId) return 'Workspace Owner';
  const member = workspace.members?.find(m => m.userId === userId);
  return member?.role ?? null;
};

/** max(global role, workspace role) within a single workspace. */
export const effectiveWorkspaceLevel = (
  user: Pick<IUser, 'id' | 'role'> | null,
  workspace?: Pick<IWorkspace, 'ownerId' | 'members'> | null
): number => {
  const global = user ? levelOf(user.role) : 0;
  const inWs = user ? levelOf(workspaceRoleOf(workspace, user.id)) : 0;
  return Math.max(global, inWs);
};

/** Highest effective level across all workspaces (used for global pages like Reports). */
export const maxEffectiveLevel = (
  user: Pick<IUser, 'id' | 'role'> | null,
  workspaces: Array<Pick<IWorkspace, 'ownerId' | 'members'>> = []
): number => {
  if (!user) return 0;
  let level = levelOf(user.role);
  for (const ws of workspaces) level = Math.max(level, levelOf(workspaceRoleOf(ws, user.id)));
  return level;
};

/** Compact permission bundle used to gate project/kanban UI. */
export interface ProjectPermissions {
  level: number;
  /** Any workspace member, including guests. */
  canView: boolean;
  /** Team Member + — move tasks, comment. */
  canContribute: boolean;
  /** Admin + — workspace/member management. */
  canAdmin: boolean;
  /** Project Manager + — create tasks/sprints, edit projects. */
  canManage: boolean;
  isGuest: boolean;
}

export const projectPermissions = (
  user: Pick<IUser, 'id' | 'role'> | null,
  workspace?: Pick<IWorkspace, 'ownerId' | 'members'> | null
): ProjectPermissions => {
  const level = effectiveWorkspaceLevel(user, workspace);
  return {
    level,
    canView: level >= LEVEL.read,
    canContribute: level >= LEVEL.contribute,
    canAdmin: level >= LEVEL.admin,
    canManage: level >= LEVEL.manage,
    isGuest: level <= LEVEL.read,
  };
};