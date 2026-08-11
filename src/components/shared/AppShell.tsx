import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { IUser, IWorkspace } from "@/types";

interface AppShellProps {
  user: IUser;
  workspaces: IWorkspace[];
  activeWorkspace?: IWorkspace | null;
  isGuest?: boolean;
  canCreateProject?: boolean;
  children: React.ReactNode;
}

/** Standard logged-in page frame: Navbar + Sidebar + scrollable content. */
export default function AppShell({
  user,
  workspaces,
  activeWorkspace,
  isGuest = false,
  canCreateProject = true,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} isGuest={isGuest} canCreateProject={canCreateProject} />
      <div className="flex flex-1">
        <Sidebar workspaces={workspaces} activeWorkspace={activeWorkspace} user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="app-dotgrid min-h-full px-6 py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}